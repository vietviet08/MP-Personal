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

// Hàm để tạo từ khóa từ excerpt để tạo cover image URL
function extractKeywords(text: string): string {
    // Loại bỏ các từ stopwords và lấy từ khóa chính
    const stopwords = [
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "have",
        "has",
        "had",
        "will",
        "would",
        "could",
        "should",
        "may",
        "might",
        "must",
        "can",
        "do",
        "does",
        "did",
    ];

    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopwords.includes(word))
        .slice(0, 2); // Lấy 2 từ khóa chính

    return words.join(",") || "blog,article";
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
- Viết nội dung blog chi tiết 800-1200 từ bằng tiếng Việt
- Sử dụng cấu trúc markdown với heading (##, ###)
- Nội dung phải có giá trị, thông tin chính xác, dễ hiểu
- Bao gồm: giới thiệu, phân tích chi tiết, ví dụ thực tế, kết luận
- Tránh nội dung chung chung, hãy cụ thể và chuyên sâu

Trả về ĐÚNG định dạng JSON sau (không thêm markdown formatting hoặc text nào khác):
{
  "title": "tiêu đề hấp dẫn",
  "excerpt": "mô tả ngắn gọn đã cải thiện",
  "content": "nội dung blog đầy đủ với markdown formatting",
  "cover_image_url": "https://source.unsplash.com/1600x900/?keyword1,keyword2"
}

Chỉ trả về JSON thuần túy, không có text giải thích hay markdown wrapper.`;

        const result = await model.generateContent(prompt);

        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Gemini returned empty response");
        }

        // Parse JSON response from Gemini
        let parsedResult: AIGenerateResponse;
        try {
            // Clean response text - remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
            parsedResult = JSON.parse(cleanText);
        } catch {
            console.error(
                "Failed to parse Gemini response:",
                text.substring(0, 200)
            );
            throw new Error("Gemini returned invalid JSON format");
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

        // Ensure cover_image_url exists
        if (!parsedResult.cover_image_url) {
            const keywords = extractKeywords(excerpt);
            parsedResult.cover_image_url = `https://source.unsplash.com/1600x900/?${keywords}`;
        }

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
