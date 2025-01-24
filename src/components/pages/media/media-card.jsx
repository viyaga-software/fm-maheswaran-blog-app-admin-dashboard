"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { cn, getExtensionOfImage, truncateString } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const MediaCard = ({ url, alternativeText, name, width, height, ext }) => {
  const [copied, setCopied] = useState(false);
  const imgUrl = url?.startsWith("http") ? url : `http://localhost:1337${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(imgUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
  };

  return (
    <Card className="rounded-sm dark:bg-gray-950">
      <CardHeader className="space-y-0 p-1">
        <img
          src={imgUrl}
          alt={alternativeText}
          className="aspect-video object-contain border border-gray-200 w-full rounded-sm overflow-hidden dark:border-gray-800"
          width="500"
          height="300"
        />
      </CardHeader>
      <CardContent className="space-y-0 p-2 flex justify-between">
        <div>
          <h4 className="text-sm font-bold m-0">{truncateString(name, 20)}</h4>
          <p className="text-sm text-gray-600">{`${getExtensionOfImage(ext).toUpperCase()} - ${width}X${height}`}</p>
        </div>
        <button
          onClick={handleCopy}
          className={cn(buttonVariants({ variant: 'default' }))}
        // className="mt-3 px-2 py-1 bg-blue-900 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </CardContent>
    </Card>
  );
};

export default MediaCard