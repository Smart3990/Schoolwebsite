import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Manage your dashboard preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <Input
                id="username"
                defaultValue="admin"
                data-testid="input-username-settings"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                defaultValue="admin@nvtikanda.edu.gh"
                data-testid="input-email-settings"
              />
            </div>
            <Button className="hover-elevate active-elevate-2" data-testid="button-save-settings">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                data-testid="input-current-password"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                data-testid="input-new-password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                data-testid="input-confirm-password"
              />
            </div>
            <Button className="hover-elevate active-elevate-2" data-testid="button-change-password">
              Update Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>Configure website preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium mb-2">
                Site Title
              </label>
              <Input
                id="site-title"
                defaultValue="NVTI Kanda - National Vocational Training Institute"
                data-testid="input-site-title"
              />
            </div>
            <div>
              <label htmlFor="site-description" className="block text-sm font-medium mb-2">
                Site Description
              </label>
              <Input
                id="site-description"
                defaultValue="Empowering Knowledge, Skills and Practice"
                data-testid="input-site-description"
              />
            </div>
            <Button className="hover-elevate active-elevate-2" data-testid="button-save-website-settings">
              <Save className="h-4 w-4 mr-2" />
              Save Website Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
