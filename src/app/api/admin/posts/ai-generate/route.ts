import { NextRequest, NextResponse } from "next/server";

interface AIGenerateRequest {
    excerpt: string;
}

interface AIGenerateResponse {
    title: string;
    excerpt: string;
    content: string;
    cover_image_url: string;
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

// Hàm sinh nội dung blog từ excerpt
function generateBlogContent(excerpt: string): AIGenerateResponse {
    if (!excerpt || excerpt.trim().length === 0) {
        throw new Error("Excerpt is required");
    }

    // Tạo tiêu đề từ excerpt
    const title =
        excerpt.length > 50 ? excerpt.substring(0, 50).trim() + "..." : excerpt;

    // Cải thiện excerpt (giữ nguyên hoặc cải thiện nhẹ)
    const improvedExcerpt = excerpt.trim().endsWith(".")
        ? excerpt.trim()
        : excerpt.trim() + ".";

    // Tạo keywords cho cover image
    const keywords = extractKeywords(excerpt);

    // Sinh nội dung blog chi tiết
    const content = `# ${title}

${improvedExcerpt}

## Giới thiệu

Trong bài viết này, chúng ta sẽ tìm hiểu chi tiết về chủ đề được đề cập trong excerpt. Đây là một chủ đề thú vị và có nhiều khía cạnh đáng khám phá.

## Tầm quan trọng của vấn đề

Vấn đề được nêu ra không chỉ có ý nghĩa lý thuyết mà còn có ứng dụng thực tiễn cao. Việc hiểu rõ và nắm vững các khái niệm cơ bản sẽ giúp chúng ta:

- Có cái nhìn tổng quan về chủ đề
- Áp dụng kiến thức vào thực tế
- Phát triển tư duy phản biện
- Mở rộng hiểu biết trong lĩnh vực liên quan

## Phân tích chi tiết

### Khía cạnh thứ nhất

Đây là một trong những khía cạnh quan trọng nhất của chủ đề. Chúng ta cần xem xét kỹ lưỡng các yếu tố ảnh hưởng và mối quan hệ giữa chúng.

Các điểm chính cần lưu ý:
1. Nguyên lý cơ bản
2. Ứng dụng thực tế  
3. Lợi ích và hạn chế
4. Hướng phát triển tương lai

### Khía cạnh thứ hai

Một góc nhìn khác không kém phần thú vị là việc phân tích từ khía cạnh này. Nó bổ sung và làm phong phú thêm cách hiểu của chúng ta về vấn đề.

## Ví dụ thực tế

Để minh họa cho những lý thuyết đã trình bày, hãy cùng xem xét một số ví dụ cụ thể:

**Ví dụ 1:** Trường hợp điển hình cho thấy cách áp dụng kiến thức vào thực tế một cách hiệu quả.

**Ví dụ 2:** Một tình huống phức tạp hơn đòi hỏi sự linh hoạt trong cách tiếp cận.

## So sánh và đối chiếu

| Tiêu chí | Phương pháp A | Phương pháp B |
|----------|---------------|---------------|
| Hiệu quả | Cao | Trung bình |
| Chi phí | Thấp | Cao |
| Thời gian | Nhanh | Chậm |
| Độ phức tạp | Đơn giản | Phức tạp |

## Kinh nghiệm và bài học

Qua quá trình nghiên cứu và thực hành, chúng ta có thể rút ra một số bài học quý giá:

- **Kiên nhẫn và kiên trì:** Không có thành công nào đến một cách dễ dàng
- **Học hỏi liên tục:** Luôn cập nhật kiến thức và kỹ năng mới
- **Thực hành thường xuyên:** Lý thuyết phải đi đôi với thực hành
- **Chia sẻ kiến thức:** Giúp đỡ người khác cũng là cách học tập

## Những thách thức và cách khắc phục

Mọi lĩnh vực đều có những thách thức riêng. Việc nhận diện sớm và có phương pháp khắc phục phù hợp sẽ giúp chúng ta tiến bộ nhanh hơn.

### Thách thức phổ biến:
- Thiếu kiến thức nền tảng
- Khó khăn trong việc áp dụng lý thuyết
- Áp lực thời gian và kết quả
- Sự thay đổi nhanh chóng của công nghệ

### Giải pháp đề xuất:
- Xây dựng lộ trình học tập có hệ thống
- Tìm mentor và cộng đồng hỗ trợ
- Thực hành với các dự án thực tế
- Luôn cập nhật xu hướng mới

## Kết luận

Qua bài viết này, chúng ta đã cùng nhau khám phá nhiều khía cạnh thú vị của chủ đề. Hy vọng rằng những kiến thức và kinh nghiệm được chia sẻ sẽ hữu ích cho bạn trong hành trình học tập và phát triển.

Hãy nhớ rằng, việc học không bao giờ dừng lại. Mỗi ngày đều là một cơ hội để chúng ta hoàn thiện bản thân và đạt được những mục tiêu đã đề ra.

## Tài liệu tham khảo

- Nguồn tin cậy trong lĩnh vực
- Nghiên cứu khoa học liên quan  
- Kinh nghiệm từ các chuyên gia
- Cộng đồng thảo luận trực tuyến

*Bài viết này được tạo tự động từ excerpt bằng AI. Nội dung có thể được chỉnh sửa và bổ sung theo nhu cầu cụ thể.*`;

    const result = {
        title: title.trim(),
        excerpt: improvedExcerpt.trim(),
        content: content.trim(),
        cover_image_url: `https://source.unsplash.com/1600x900/?${keywords}`,
    };

    // Validate the result before returning
    if (!result.title || !result.content) {
        throw new Error("Failed to generate valid blog content");
    }

    return result;
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
            generatedContent = generateBlogContent(excerpt.trim());
        } catch (error) {
            console.error("Error in generateBlogContent:", error);
            return NextResponse.json(
                { error: "Failed to generate blog content" },
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
            { error: "Failed to generate blog content" },
            { status: 500 }
        );
    }
}
