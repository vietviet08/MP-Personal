"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";

// Import PrismJS themes and languages
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-git";
import "prismjs/components/prism-markdown";

interface SyntaxHighlighterProps {
    code: string;
    language?: string;
    className?: string;
}

export function SyntaxHighlighter({
    code,
    language = "javascript",
    className = "",
}: SyntaxHighlighterProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            try {
                Prism.highlightElement(codeRef.current);
            } catch (error) {
                console.warn("PrismJS highlighting failed:", error);
            }
        }
    }, [code, language]);

    return (
        <pre className={`language-${language} ${className}`}>
            <code ref={codeRef} className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
}

// Component để xử lý HTML content có chứa code blocks
interface CodeBlockProcessorProps {
    htmlContent: string;
    className?: string;
}

export function CodeBlockProcessor({
    htmlContent,
    className = "",
}: CodeBlockProcessorProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Wait for DOM to be ready
            const highlightCode = () => {
                // Find all pre > code blocks and highlight them with PrismJS
                const codeBlocks =
                    containerRef.current?.querySelectorAll("pre code");
                console.log("Found code blocks:", codeBlocks?.length || 0);
                if (!codeBlocks || codeBlocks.length === 0) return;

                codeBlocks.forEach((block) => {
                    // Detect language from class or try to auto-detect
                    const preElement = block.parentElement;
                    if (!preElement) return;

                    const classList = Array.from(preElement.classList || []);
                    const languageClass = classList.find((cls) =>
                        cls.startsWith("language-")
                    );
                    const language = languageClass
                        ? languageClass.replace("language-", "")
                        : "javascript";

                    // Set the language class
                    block.className = `language-${language}`;
                    preElement.classList.add(`language-${language}`);

                    // Apply PrismJS highlighting
                    try {
                        console.log(
                            "Highlighting code block with language:",
                            language
                        );
                        Prism.highlightElement(block as HTMLElement);
                        console.log(
                            "PrismJS highlighting applied successfully"
                        );
                    } catch (error) {
                        console.warn("PrismJS highlighting failed:", error);
                        // Fallback to basic styling
                        (block as HTMLElement).style.color = "#e2e8f0";
                        (block as HTMLElement).style.backgroundColor =
                            "transparent";
                    }

                    // Add copy functionality
                    if (!preElement.dataset.copyAdded) {
                        preElement.dataset.copyAdded = "true";

                        // Add copy button
                        const copyButton = document.createElement("button");
                        copyButton.className = "copy-button";
                        copyButton.innerHTML = "📋 Copy";
                        copyButton.style.cssText = `
                            position: absolute;
                            top: 8px;
                            right: 8px;
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            color: #e2e8f0;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                            opacity: 0;
                            transition: opacity 0.2s;
                            z-index: 10;
                        `;

                        // Make pre element relative for absolute positioning
                        preElement.style.position = "relative";
                        preElement.appendChild(copyButton);

                        // Show copy button on hover
                        preElement.addEventListener("mouseenter", () => {
                            copyButton.style.opacity = "1";
                        });
                        preElement.addEventListener("mouseleave", () => {
                            copyButton.style.opacity = "0";
                        });

                        copyButton.addEventListener("click", async (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            try {
                                await navigator.clipboard.writeText(
                                    block.textContent || ""
                                );

                                copyButton.innerHTML = "✅ Copied!";
                                setTimeout(() => {
                                    copyButton.innerHTML = "📋 Copy";
                                }, 2000);
                            } catch (err) {
                                console.error("Failed to copy text: ", err);
                                copyButton.innerHTML = "❌ Failed";
                                setTimeout(() => {
                                    copyButton.innerHTML = "📋 Copy";
                                }, 2000);
                            }
                        });
                    }
                });
            };

            // Use setTimeout to ensure DOM is ready
            const timeoutId = setTimeout(highlightCode, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [htmlContent]);

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
