import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Server, Download, Play } from "lucide-react";

export const LMStudioSetup = () => {
  return (
    <Card className="p-6 bg-gradient-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Server className="w-5 h-5" />
        LM Studio Setup Guide
      </h3>
      
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            This app uses LM Studio with GPT-OSS models for offline AI conversations. Follow these steps to set it up:
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Download LM Studio</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Download and install LM Studio from the official website.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://lmstudio.ai" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download LM Studio
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Download GPT-OSS Models</h4>
              <p className="text-sm text-muted-foreground mb-2">
                In LM Studio, search for and download these models:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• <code className="bg-muted px-1 rounded">gpt-oss-20b</code> (recommended for chat)</li>
                <li>• <code className="bg-muted px-1 rounded">gpt-oss-120b</code> (for advanced features)</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Start Local Server</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Load a model and start the local server on port 1234.
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">http://localhost:1234/v1</code>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Test Connection</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Once running, your plant will be able to have AI-powered conversations!
              </p>
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Test Chat Now
              </Button>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> The app will work with fallback responses if LM Studio isn't running. 
            For the full AI experience, make sure LM Studio is running with a model loaded.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};