import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/repo";
import { Icon } from "@/components/ui";
import { PageHead } from "../../../ui";
import { PostForm } from "../PostForm";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <>
      <PageHead
        title={post.title}
        description={`/blog/${post.slug}`}
        action={
          post.published ? (
            <Link
              href={`/blog/${post.slug}`}
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external-link" size={16} />
              View on site
            </Link>
          ) : undefined
        }
      />
      <PostForm post={post} />
    </>
  );
}
