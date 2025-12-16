import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ExternalLink, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { getSpotifyStatus, getAuthUrl, logout } from '@/lib/spotify-api';
import { queryClient } from '@/lib/queryClient';

export function SpotifyConnect() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/spotify/status'],
    queryFn: getSpotifyStatus,
    refetchInterval: 5000,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/spotify/status'] });
    },
  });

  const handleConnect = async () => {
    const url = await getAuthUrl();
    if (url) {
      window.location.href = url;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!status?.hasCredentials) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <CardTitle>Spotify API Not Configured</CardTitle>
          </div>
          <CardDescription>
            To connect with Spotify and access real music data, you need to configure your Spotify API credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-semibold text-foreground mb-2">Setup Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Go to the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Spotify Developer Dashboard</a></li>
              <li>Create a new application</li>
              <li>Add your redirect URI (shown below)</li>
              <li>Copy your Client ID and Client Secret</li>
              <li>Add them as secrets in this Replit project</li>
            </ol>
          </div>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Required Environment Variables:</p>
            <code className="text-sm font-mono text-foreground">SPOTIFY_CLIENT_ID</code>
            <br />
            <code className="text-sm font-mono text-foreground">SPOTIFY_CLIENT_SECRET</code>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status.authenticated) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-primary" />
            <CardTitle>Connected to Spotify</CardTitle>
          </div>
          <CardDescription>
            Your Gotify app is connected to Spotify. You can now browse and play music from the Spotify catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-primary" />
          <div>
            <CardTitle>Connect to Spotify</CardTitle>
            <CardDescription>
              Link your Spotify account to access millions of songs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={handleConnect} className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Connect with Spotify
        </Button>
      </CardContent>
    </Card>
  );
}
