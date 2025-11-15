import json
import os
import subprocess
import tempfile
from django.core.management.base import BaseCommand
from django.conf import settings
from properties.models import Property

class Command(BaseCommand):
    help = 'Submit all published properties to IndexNow'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Submit all important site URLs, not just properties'
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=0,
            help='Limit number of URLs to submit (0 for no limit)'
        )
        parser.add_argument(
            '--test',
            action='store_true',
            help='Test mode - only show what would be submitted'
        )
    
    def get_base_urls(self):
        """Return important base URLs for the site"""
        return [
            'https://www.pristineprimier.com/',
            'https://www.pristineprimier.com/buy',
            'https://www.pristineprimier.com/rent',
            'https://www.pristineprimier.com/sell',
            'https://www.pristineprimier.com/services',
            'https://www.pristineprimier.com/property/houses-for-sale/',
            'https://www.pristineprimier.com/property/apartments-for-rent/',
            'https://www.pristineprimier.com/property/land-for-sale/',
            'https://www.pristineprimier.com/city/nairobi/',
            'https://www.pristineprimier.com/city/mombasa/'
        ]
    
    def get_property_urls(self):
        """Return URLs for all published properties"""
        # Use published_at__isnull=False to get published properties
        properties = Property.objects.filter(published_at__isnull=False)
        urls = []
        
        for prop in properties:
            try:
                absolute_url = prop.get_absolute_url()
                full_url = f'https://www.pristineprimier.com{absolute_url}'
                urls.append(full_url)
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ Could not get URL for property {prop.id}: {e}')
                )
        
        return urls
    
    def handle(self, *args, **options):
        # Collect URLs
        if options['all']:
            urls = self.get_base_urls()
            property_urls = self.get_property_urls()
            urls.extend(property_urls)
            self.stdout.write(f'📝 Collected {len(urls)} URLs (base + properties)')
        else:
            urls = self.get_property_urls()
            self.stdout.write(f'📝 Collected {len(urls)} property URLs')
        
        # Apply limit if specified
        if options['limit'] > 0:
            urls = urls[:options['limit']]
            self.stdout.write(f'🔒 Limited to {len(urls)} URLs')
        
        if not urls:
            self.stdout.write(self.style.WARNING('⚠️ No URLs to submit'))
            return
        
        # Test mode - just show URLs
        if options['test']:
            self.stdout.write(self.style.SUCCESS('🧪 TEST MODE - URLs that would be submitted:'))
            for url in urls:
                self.stdout.write(f'  {url}')
            self.stdout.write(f'Total: {len(urls)} URLs')
            return
        
        # Get the path to the Node.js script
        script_path = os.path.join(
            settings.BASE_DIR, 
            'indexnow-submitter.js'
        )
        
        if not os.path.exists(script_path):
            self.stdout.write(
                self.style.ERROR(f'❌ IndexNow script not found at: {script_path}')
            )
            return
        
        # Create temporary Node.js script to call our function
        temp_script = f"""
const {{ submitToIndexNow }} = require("{script_path}");

const urls = {json.dumps(urls)};

submitToIndexNow(urls)
    .then(result => {{
        console.log(JSON.stringify({{success: true, result: result}}));
        process.exit(0);
    }})
    .catch(error => {{
        console.log(JSON.stringify({{success: false, error: error.message}}));
        process.exit(1);
    }});
"""
        
        # Write temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            f.write(temp_script)
            temp_script_path = f.name
        
        try:
            self.stdout.write(f'🚀 Submitting {len(urls)} URLs to IndexNow...')
            
            # Execute the Node.js script
            result = subprocess.run(
                ['node', temp_script_path],
                capture_output=True,
                text=True,
                timeout=60,  # 60 second timeout
                cwd=settings.BASE_DIR
            )
            
            # Clean up temporary file
            os.unlink(temp_script_path)
            
            # Parse result
            if result.returncode == 0:
                try:
                    output_data = json.loads(result.stdout)
                    if output_data.get('success'):
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'✅ Successfully submitted {len(urls)} URLs to IndexNow'
                            )
                        )
                        self.stdout.write(f'📊 Result: {output_data.get("result", {})}')
                    else:
                        self.stdout.write(
                            self.style.ERROR(
                                f'❌ Submission failed: {output_data.get("error", "Unknown error")}'
                            )
                        )
                except json.JSONDecodeError:
                    self.stdout.write(f'📋 Raw output: {result.stdout}')
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Script executed successfully')
                    )
            else:
                self.stdout.write(
                    self.style.ERROR(f'❌ Script execution failed: {result.stderr}')
                )
                
        except subprocess.TimeoutExpired:
            self.stdout.write(self.style.ERROR('❌ Submission timed out after 60 seconds'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Unexpected error: {e}'))