import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIGenerateRequest {
    excerpt: string;
}

interface AIGenerateResponse {
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
}

// Lazy initialize Gemini client
function getGeminiClient() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Hàm tạo cover image URL thật sự tồn tại
function generateCoverImageUrl(excerpt: string): string {
    // Danh sách các URL ảnh bìa có sẵn cho các chủ đề công nghệ
    const techCoverImages = [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&h=900&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&h=900&fit=crop&crop=center",
    ];

    // Chọn ảnh ngẫu nhiên dựa trên hash của excerpt
    const hash = excerpt.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);

    const index = Math.abs(hash) % techCoverImages.length;
    return techCoverImages[index];
}

// Hàm sinh nội dung blog từ excerpt sử dụng Google Gemini
async function generateBlogContent(
    excerpt: string
): Promise<AIGenerateResponse> {
    if (!excerpt || excerpt.trim().length === 0) {
        throw new Error("Excerpt is required");
    }

    try {
        const model = getGeminiClient();

        const prompt = `Bạn là một AI chuyên viết blog chuyên nghiệp. Hãy tạo một bài viết blog hoàn chỉnh dựa trên excerpt sau: "${excerpt}"

Yêu cầu:
- Tạo tiêu đề hấp dẫn, ngắn gọn, chuẩn SEO
- Cải thiện excerpt thành mô tả ngắn gọn (1-3 câu), dễ đọc, chuẩn SEO  
- Viết nội dung blog chi tiết 1000-1500 từ bằng tiếng Việt
- Sử dụng cấu trúc HTML với các thẻ h2, h3, p, ul, ol, strong, em, blockquote, pre, code
- Nội dung phải có giá trị, thông tin chính xác, dễ hiểu
- Bao gồm: giới thiệu, phân tích chi tiết, ví dụ thực tế, kết luận

QUAN TRỌNG CHO BÀI VIẾT CÔNG NGHỆ:
- Nếu bài viết về lập trình, framework, tutorial, kỹ thuật code:
  + BẮT BUỘC phải có ít nhất 2-3 đoạn code mẫu thực tế
  + Code phải được đặt trong thẻ <pre><code> với syntax highlighting
  + Mỗi đoạn code phải có comment giải thích chi tiết
  + Code phải hoạt động được và có thể chạy thực tế
  + Ví dụ: React components, API calls, database queries, algorithms, etc.
- Nếu bài viết về công nghệ nói chung:
  + Thêm ví dụ thực tế, case studies
  + So sánh các giải pháp khác nhau
  + Hướng dẫn step-by-step chi tiết

Cấu trúc HTML bắt buộc:
- <h2> cho các phần chính
- <h3> cho các phần con
- <p> cho đoạn văn
- <ul><li> cho danh sách
- <ol><li> cho hướng dẫn step-by-step
- <strong> cho từ khóa quan trọng
- <em> cho nhấn mạnh
- <blockquote> cho trích dẫn
- <pre><code class="language-[tên-ngôn-ngữ]"> cho code examples (VD: language-javascript, language-python, language-bash)
- <a href="..."> cho links

QUAN TRỌNG CHO CODE BLOCKS:
- Luôn sử dụng class="language-[tên-ngôn-ngữ]" trong thẻ <code>
- Các ngôn ngữ phổ biến: javascript, typescript, python, java, csharp, php, ruby, go, rust, sql, bash, json, yaml, css, html, xml, docker, git
- Ví dụ: <pre><code class="language-javascript">console.log('Hello World');</code></pre>
- Ví dụ: <pre><code class="language-bash">npm install package-name</code></pre>
- Ví dụ: <pre><code class="language-python">def hello(): print("Hello World")</code></pre>
- Code phải có comment giải thích chi tiết
- Mỗi đoạn code phải có context và mục đích rõ ràng

QUAN TRỌNG VỀ ĐỊNH DẠNG TRẢ VỀ:
- BẮT BUỘC phải trả về ĐÚNG định dạng JSON hợp lệ
- KHÔNG được bao bọc trong markdown code blocks
- KHÔNG được thêm text giải thích trước hoặc sau JSON
- KHÔNG được có trailing commas
- Tất cả strings phải được escape đúng cách
- Chỉ trả về JSON object, không có gì khác

Định dạng JSON bắt buộc:
{
  "title": "tiêu đề hấp dẫn",
  "excerpt": "mô tả ngắn gọn đã cải thiện", 
  "content": "nội dung blog đầy đủ với HTML formatting và code examples",
  "cover_image_url": "sẽ được tự động tạo"
}

VÍ DỤ ĐÚNG:
{"title":"Hướng dẫn React Hooks","excerpt":"Tìm hiểu cách sử dụng React Hooks hiệu quả","content":"<h2>Giới thiệu</h2><p>React Hooks là...</p>","cover_image_url":""}

VÍ DỤ SAI (KHÔNG LÀM):
\`\`\`json
{"title":"..."}
\`\`\`

Chỉ trả về JSON thuần túy, không có gì khác.`;

        // Try generating content with retry mechanism
        let result;
        let text;
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
            try {
                result = await model.generateContent(prompt);
                const response = result.response;
                text = response.text();
                break; // Success, exit retry loop
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw error; // Re-throw if max attempts reached
                }
                console.warn(
                    `Gemini generation attempt ${attempts} failed, retrying...`,
                    error
                );
                // Wait a bit before retry
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        if (!text) {
            throw new Error("Gemini returned empty response");
        }

        // Parse JSON response from Gemini with multiple fallback strategies
        let parsedResult: AIGenerateResponse;
        try {
            // Strategy 1: Try to find JSON in the response
            let cleanText = text.trim();

            // Remove markdown code blocks if present
            cleanText = cleanText.replace(/```json\n?|\n?```/g, "").trim();

            // Try to extract JSON from the response if it's wrapped in other text
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanText = jsonMatch[0];
            }

            // Strategy 2: Try parsing the cleaned text
            try {
                parsedResult = JSON.parse(cleanText);
            } catch {
                // Strategy 3: Try to fix common JSON issues
                let fixedText = cleanText;

                // Fix common issues:
                // - Remove trailing commas
                fixedText = fixedText.replace(/,(\s*[}\]])/g, "$1");

                // - Fix unescaped quotes in strings
                fixedText = fixedText.replace(
                    /"([^"]*)"([^"]*)"([^"]*)":/g,
                    '"$1$2$3":'
                );

                // - Ensure proper JSON structure
                if (!fixedText.startsWith("{")) {
                    const startIndex = fixedText.indexOf("{");
                    if (startIndex !== -1) {
                        fixedText = fixedText.substring(startIndex);
                    }
                }

                if (!fixedText.endsWith("}")) {
                    const lastIndex = fixedText.lastIndexOf("}");
                    if (lastIndex !== -1) {
                        fixedText = fixedText.substring(0, lastIndex + 1);
                    }
                }

                parsedResult = JSON.parse(fixedText);
            }
        } catch (parseError) {
            console.error(
                "Failed to parse Gemini response after all strategies:"
            );
            console.error("Original response:", text.substring(0, 500));
            console.error("Parse error:", parseError);

            // Strategy 4: Try to extract data manually using regex (handles multiline content)
            try {
                // More flexible regex patterns that handle multiline content
                const titleMatch = text.match(
                    /"title"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/
                );
                const excerptMatch = text.match(
                    /"excerpt"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/
                );
                const contentMatch = text.match(
                    /"content"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/
                );

                // If multiline regex doesn't work, try simpler approach
                let title = titleMatch?.[1];
                let excerpt = excerptMatch?.[1];
                let content = contentMatch?.[1];

                if (!title || !excerpt || !content) {
                    // Try to find the values with more flexible patterns
                    const lines = text.split("\n");
                    for (const line of lines) {
                        if (line.includes('"title"') && !title) {
                            const match = line.match(/"title"\s*:\s*"([^"]+)"/);
                            if (match) title = match[1];
                        }
                        if (line.includes('"excerpt"') && !excerpt) {
                            const match = line.match(
                                /"excerpt"\s*:\s*"([^"]+)"/
                            );
                            if (match) excerpt = match[1];
                        }
                        if (line.includes('"content"') && !content) {
                            // For content, we need to handle multiline HTML
                            const contentStart = line.indexOf('"content"');
                            if (contentStart !== -1) {
                                const contentValue = line
                                    .substring(contentStart + 10)
                                    .trim();
                                if (
                                    contentValue.startsWith('"') &&
                                    contentValue.endsWith('"')
                                ) {
                                    content = contentValue.slice(1, -1);
                                } else if (contentValue.startsWith('"')) {
                                    // Multiline content - find the closing quote
                                    let fullContent = contentValue.slice(1);
                                    const nextLineIndex =
                                        lines.indexOf(line) + 1;
                                    for (
                                        let i = nextLineIndex;
                                        i < lines.length;
                                        i++
                                    ) {
                                        const nextLine = lines[i];
                                        if (
                                            nextLine.includes('"') &&
                                            nextLine.includes("}")
                                        ) {
                                            const endQuoteIndex =
                                                nextLine.indexOf('"');
                                            fullContent +=
                                                "\n" +
                                                nextLine.substring(
                                                    0,
                                                    endQuoteIndex
                                                );
                                            break;
                                        } else {
                                            fullContent += "\n" + nextLine;
                                        }
                                    }
                                    content = fullContent;
                                }
                            }
                        }
                    }
                }

                if (title && excerpt && content) {
                    parsedResult = {
                        title: title.replace(/\\"/g, '"').replace(/\\n/g, "\n"),
                        excerpt: excerpt
                            .replace(/\\"/g, '"')
                            .replace(/\\n/g, "\n"),
                        content: content
                            .replace(/\\"/g, '"')
                            .replace(/\\n/g, "\n"),
                        cover_image_url: "", // Will be set later
                    };
                } else {
                    console.error("Could not extract required fields:");
                    console.error("Title found:", !!title);
                    console.error("Excerpt found:", !!excerpt);
                    console.error("Content found:", !!content);
                    throw new Error("Could not extract data from response");
                }
            } catch (extractError) {
                console.error("Failed to extract data manually:", extractError);
                throw new Error(
                    "Gemini returned invalid JSON format and could not be parsed"
                );
            }
        }

        // Validate the result
        if (
            !parsedResult.title ||
            !parsedResult.content ||
            !parsedResult.excerpt
        ) {
            console.error("Gemini returned incomplete data:", parsedResult);
            throw new Error("Gemini returned incomplete blog content");
        }

        // Generate cover image URL
        parsedResult.cover_image_url = generateCoverImageUrl(excerpt);

        return parsedResult;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to generate blog content with Gemini");
    }
}

export async function POST(request: NextRequest) {
    try {
        const { excerpt }: AIGenerateRequest = await request.json();

        if (!excerpt || excerpt.trim().length === 0) {
            return NextResponse.json(
                { error: "Excerpt is required" },
                { status: 400 }
            );
        }

        if (excerpt.length > 500) {
            return NextResponse.json(
                { error: "Excerpt is too long (max 500 characters)" },
                { status: 400 }
            );
        }

        // Sinh nội dung blog từ excerpt
        let generatedContent;
        try {
            generatedContent = await generateBlogContent(excerpt.trim());
        } catch (error) {
            console.error("Error in generateBlogContent:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            return NextResponse.json(
                {
                    error: `Failed to generate blog content with Gemini: ${errorMessage}`,
                },
                { status: 500 }
            );
        }

        // Validate generated content
        if (
            !generatedContent ||
            !generatedContent.title ||
            !generatedContent.content
        ) {
            console.error("Generated content is invalid:", generatedContent);
            return NextResponse.json(
                { error: "Failed to generate valid content" },
                { status: 500 }
            );
        }

        // Optional: Log success (can be removed in production)
        // console.log("AI content generated successfully for excerpt:", excerpt.substring(0, 50));

        return NextResponse.json(generatedContent);
    } catch (error) {
        console.error("Error generating blog content:", error);
        return NextResponse.json(
            { error: "Failed to generate blog content with Gemini" },
            { status: 500 }
        );
    }
}
