import { PageHead } from "../../../ui";
import { PostForm } from "../PostForm";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <PageHead
        title="New post"
        description="Nothing appears on the blog until you switch Published on."
      />
      <PostForm />
    </>
  );
}
