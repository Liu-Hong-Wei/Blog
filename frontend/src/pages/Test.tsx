import type { ReactElement} from "react";
import { useEffect, useState } from "react";

import { ComponentLoadingSpinner } from "../components/Spinners";
import Error from "./errors/Error";
import markdownToHtml from "../utils/markdownToHtml";

const post = {
    content: `# Sample Post

This is a sample post to demonstrate **markdown** rendering.`
}

function Test() {
    const [renderedContent, setRenderedContent] = useState<ReactElement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!post?.content) {
            setRenderedContent(null);
            return;
        }
        setIsProcessing(true);
        markdownToHtml(post.content)
            .then((result) => {
                setRenderedContent(result.success ? result.content || null : null);
            })
            .catch((error) => {
                console.error('Markdown processing failed:', error);
                setRenderedContent(null);
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }, []);

    return (
        <main className="max-w-full">
            {isProcessing && (<ComponentLoadingSpinner loading="Sit back and relax..." />)}
            {!isProcessing && renderedContent}
            {/* 加载中状态（仅 markdown 处理） */}
            {!isProcessing && post && !post.content && (
                <Error emoji='🤔' content='This post is empty?!' />
            )}
        </main>);
}

export default Test;