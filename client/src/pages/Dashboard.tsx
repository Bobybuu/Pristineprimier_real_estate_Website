import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, Plus, FileText, Settings, Users, BarChart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockProperties, mockAdminStats } from '@/lib/mockData';
import { toast } from 'sonner';

// Simple dashboard for sellers
const SellerDashboard = () => {
  const navigate = useNavigate();
  const [userListings, setUserListings] = useState(mockProperties.slice(0, 3));

  const handleLogout = () => {
    // TODO: Implement actual logout
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      sale: 'default',
      rent: 'secondary',
      sold: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-secondary py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
              <p className="text-muted-foreground">Manage your property listings</p>
            </div>
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard/seller/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Listing
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userListings.length}</div>
                <p className="text-xs text-muted-foreground">Active properties</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Listings Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>${listing.price.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell>{listing.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/property/${listing.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Admin dashboard with user and listing management
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState(mockProperties);

  const handleApprove = async (id: string) => {
    // TODO: Replace with actual API call - PATCH /api/admin/listings/{id}
    toast.success('Listing approved successfully');
  };

  const handleDelete = async (id: string) => {
    // TODO: Replace with actual API call - DELETE /api/admin/listings/{id}
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast.success('Listing deleted successfully');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-secondary py-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all listings and users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAdminStats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAdminStats.totalListings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAdminStats.pendingVerifications}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(mockAdminStats.totalRevenue / 1000000).toFixed(1)}M</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button variant="hero" size="lg" className="w-full" asChild>
              <Link to="/dashboard/admin/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Property
              </Link>
            </Button>
            <Button variant="teal" size="lg" className="w-full">
              <Users className="h-5 w-5 mr-2" />
              Manage Users
            </Button>
            <Button variant="accent" size="lg" className="w-full">
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </div>

          {/* All Listings Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>${listing.price.toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{listing.type}</TableCell>
                      <TableCell className="capitalize">{listing.status}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/property/${listing.id}`}>View</Link>
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleApprove(listing.id)}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(listing.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Main Dashboard component that routes based on role
const Dashboard = () => {
  // TODO: Get user role from auth context
  const userRole = 'seller' as 'seller' | 'admin' | 'agent';

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  return <SellerDashboard />;
};

export default Dashboard;
export { SellerDashboard, AdminDashboard };
