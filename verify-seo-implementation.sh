#!/bin/bash

# SEO Implementation Verification Script for PristinePrimier
echo "Ì¥ç SEO Implementation Verification Checklist"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if file exists and has content
check_file_content() {
    local file_path="$1"
    local search_term="$2"
    local description="$3"
    
    if [ -f "$file_path" ]; then
        if grep -q "$search_term" "$file_path"; then
            echo -e "${GREEN}‚úÖ $description - FOUND: $search_term${NC}"
            return 0
        else
            echo -e "${RED}‚ùå $description - MISSING: $search_term${NC}"
            return 1
        fi
    else
        echo -e "${RED}‚ùå $description - FILE NOT FOUND: $file_path${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local url="$1"
    local expected_field="$2"
    local description="$3"
    
    if command -v curl &> /dev/null; then
        response=$(curl -s "$url")
        if echo "$response" | grep -q "\"$expected_field\""; then
            echo -e "${GREEN}‚úÖ $description - Field '$expected_field' exists${NC}"
            return 0
        else
            echo -e "${RED}‚ùå $description - Missing field '$expected_field'${NC}"
            return 1
        fi
    else
        echo -e "${RED}‚ùå $description - curl not available${NC}"
        return 1
    fi
}

# Function to check URL structure
test_url_structure() {
    local url="$1"
    local description="$2"
    
    if command -v curl &> /dev/null; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status_code" -eq 200 ]; then
            echo -e "${GREEN}‚úÖ $description - Accessible (HTTP $status_code)${NC}"
            return 0
        else
            echo -e "${RED}‚ùå $description - Not accessible (HTTP $status_code)${NC}"
            return 1
        fi
    else
        echo -e "${RED}‚ùå $description - curl not available${NC}"
        return 1
    fi
}

# Function to test API with basic JSON parsing (no jq required)
test_api_basic() {
    local url="$1"
    local expected_field="$2"
    local description="$3"
    
    if command -v curl &> /dev/null; then
        response=$(curl -s "$url")
        # Basic JSON field check without jq
        if echo "$response" | grep -q "\"$expected_field\""; then
            field_value=$(echo "$response" | grep -o "\"$expected_field\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 | cut -d'"' -f4)
            echo -e "${GREEN}‚úÖ $description - Field '$expected_field' exists${NC}"
            if [ -n "$field_value" ]; then
                echo -e "${YELLOW}   Value: $field_value${NC}"
            fi
            return 0
        else
            echo -e "${RED}‚ùå $description - Missing field '$expected_field'${NC}"
            return 1
        fi
    else
        echo -e "${RED}‚ùå $description - curl not available${NC}"
        return 1
    fi
}

# ===== VERIFICATION STEPS =====

echo -e "\n${CYAN}Ì≥Å 1. FILE STRUCTURE VERIFICATION${NC}"

# Check sitemap.xml
check_file_content "public/sitemap.xml" "sitemap.org" "Sitemap file"

# Check robots.txt
check_file_content "public/robots.txt" "Sitemap:" "Robots file"

echo -e "\n${CYAN}Ì¥ó 2. URL STRUCTURE VERIFICATION${NC}"

# Test main pages
urls=(
    "https://www.pristineprimier.com/"
    "https://www.pristineprimier.com/buy"
    "https://www.pristineprimier.com/rent"
    "https://www.pristineprimier.com/sell"
)

for url in "${urls[@]}"; do
    test_url_structure "$url" "$url"
done

echo -e "\n${CYAN}Ì¥Ñ 3. API ENDPOINT VERIFICATION${NC}"

# Test API endpoints
test_api_endpoint "https://api.pristineprimier.com/api/properties/" "results" "Properties API"
test_api_basic "https://api.pristineprimier.com/api/properties/1/" "seo_slug" "Property SEO fields"

echo -e "\n${CYAN}Ì≥Ñ 4. REACT COMPONENT VERIFICATION${NC}"

# Check React components
check_file_content "src/components/PropertyCard.tsx" "seo_slug" "PropertyCard component"
check_file_content "src/pages/PropertyDetails.tsx" "getBySlug" "PropertyDetails component"
check_file_content "src/hooks/useProperties.ts" "seo_slug" "useProperties hook"

echo -e "\n${CYAN}ÌæØ 5. SEO META TAGS VERIFICATION${NC}"

# Check for meta tags
check_file_content "src/pages/PropertyDetails.tsx" "seo_title" "SEO Title"
check_file_content "src/pages/PropertyDetails.tsx" "seo_description" "SEO Description"
check_file_content "src/pages/PropertyDetails.tsx" "canonical" "Canonical URL"

echo -e "\n${CYAN}Ìºê 6. DYNAMIC SLUG GENERATION TEST${NC}"

# Test if properties have SEO slugs (without jq)
if command -v curl &> /dev/null; then
    response=$(curl -s "https://api.pristineprimier.com/api/properties/")
    if [ $? -eq 0 ]; then
        # Count properties with SEO slugs using basic text processing
        slug_count=$(echo "$response" | grep -o "\"seo_slug\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | grep -v "\"seo_slug\":\"\"" | wc -l)
        if [ "$slug_count" -gt 0 ]; then
            echo -e "${GREEN}‚úÖ $slug_count properties have SEO slugs${NC}"
            echo -e "${YELLOW}   Sample slugs:${NC}"
            echo "$response" | grep -o "\"seo_slug\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -3 | while read -r line; do
                slug=$(echo "$line" | cut -d'"' -f4)
                echo -e "   - $slug"
            done
        else
            echo -e "${RED}‚ùå No properties have SEO slugs generated${NC}"
        fi
    else
        echo -e "${RED}‚ùå Could not fetch properties from API${NC}"
    fi
else
    echo -e "${YELLOW}‚ö†Ô∏è  curl not available for detailed slug test${NC}"
fi

echo -e "\n${CYAN}Ìæ™ 7. PROPERTY URL TEST${NC}"

# Test individual property with SEO slug
if command -v curl &> /dev/null; then
    echo -e "${YELLOW}Testing individual property SEO data...${NC}"
    property_data=$(curl -s "https://api.pristineprimier.com/api/properties/1/")
    
    # Extract fields without jq
    id=$(echo "$property_data" | grep -o "\"id\"[[:space:]]*:[[:space:]]*[0-9]*" | grep -o "[0-9]*")
    title=$(echo "$property_data" | grep -o "\"title\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4)
    seo_slug=$(echo "$property_data" | grep -o "\"seo_slug\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4)
    seo_title=$(echo "$property_data" | grep -o "\"seo_title\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4)
    
    if [ -n "$seo_slug" ] && [ "$seo_slug" != "null" ]; then
        echo -e "${GREEN}‚úÖ Property $id has SEO slug: $seo_slug${NC}"
        echo -e "${YELLOW}   SEO Title: $seo_title${NC}"
        echo -e "${YELLOW}   Property URL: https://www.pristineprimier.com/property/$seo_slug${NC}"
        
        # Test the SEO URL
        test_url_structure "https://www.pristineprimier.com/property/$seo_slug" "SEO Property URL"
    else
        echo -e "${RED}‚ùå Property $id missing SEO slug${NC}"
        echo -e "${YELLOW}   Title: $title${NC}"
    fi
fi

echo -e "\n${CYAN}Ì≥ä 8. MANUAL CHECKS REQUIRED${NC}"
echo "============="

echo -e "${YELLOW}Run these manual checks in your browser:${NC}"
echo "1. Visit: https://www.pristineprimier.com/sitemap.xml"
echo "2. Visit: https://www.pristineprimier.com/robots.txt"  
echo "3. Test property URLs with slugs in browser"
echo "4. Check Google Search Console for sitemap status"
echo "5. Verify meta tags in browser developer tools"

echo -e "\n${GREEN}Ìæâ Verification Complete!${NC}"

# Additional quick tests
echo -e "\n${CYAN}Ì∫Ä QUICK TESTS${NC}"
echo "============"

# Test if we can access the SEO property URL
if [ -n "$seo_slug" ] && [ "$seo_slug" != "null" ]; then
    echo -e "${YELLOW}Testing SEO URL: https://www.pristineprimier.com/property/$seo_slug${NC}"
    curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" "https://www.pristineprimier.com/property/$seo_slug"
fi

echo -e "\n${GREEN}‚úÖ All checks completed!${NC}"
