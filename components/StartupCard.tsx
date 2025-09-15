import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "./ui/skeleton";

export type StartupCardType = Omit<Startup, "author"> & { author?: Author };

const StartupCard = ({ post }: { post: StartupCardType }) => {
  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(post._createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{post.views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${post.author?._id}`}>
            <p className="text-16-medium line-clamp-1">{post.author?.name}</p>
          </Link>
          <Link href={`/startup/${post._id}`}>
            <h3 className="text-26-semibold line-clamp-1">
              {post.description}
            </h3>
          </Link>
        </div>
        <Link href={`/user/${post.author?._id}`}>
          <Image
            src={post.image || "https://placehold.co/48x48/png"}
            alt={
              post.author?.name ? `${post.author.name} avatar` : "Author avatar"
            }
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/startup/${post._id}`}>
        <p className="startup-card_desc">{post.description}</p>
        {/* Added explicit width/height to satisfy Next/Image requirements when dynamic remote URL is used */}
        <Image
          src={post.image || "https://placehold.co/800x400/png"}
          alt={
            post.description
              ? `${post.description.slice(0, 60)} thumbnail`
              : "Startup thumbnail"
          }
          width={800}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="startup-card_img"
          priority={false}
        />
      </Link>
      <div className="flex-between gap-3 mt-5">
        <Link href={`/query=${post.category}`.toLowerCase()}>
          <p className="text-16-medium">{post.category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${post._id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const SkeletonStartupCard = () => {
  return (
    <>
      {[0, 1, 2, 3, 4].map((index: number) => {
        return (
          <li key={cn("skeleton", index)}>
            <Skeleton className="startup-card_skeleton" />
          </li>
        );
      })}
    </>
  );
};

export default StartupCard;
