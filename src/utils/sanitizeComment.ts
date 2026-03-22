// ** Config
import {BANNED_WORDS, URL_REGEX, VALID_EMO_REGEX} from "@/configs/sanitizeComment";

export type TSanitizeResult =
    | { ok: true; value: string }
    | { ok: false; error: string }

export const sanitizeComment = (input: string): TSanitizeResult => {
    // 1. Trim whitespace
    const trimmed = input.trim()

    // 2. Temporarily replace valid <emo> tags with placeholders to preserve them
    const emoPlaceholders: string[] = []
    const withPlaceholders = trimmed.replace(VALID_EMO_REGEX, (match) => {
        emoPlaceholders.push(match)
        return `__EMO_${emoPlaceholders.length - 1}__`
    })

    // 3. Strip all remaining HTML tags
    const stripped = withPlaceholders.replace(/<[^>]*>/g, '')

    // 4. Restore valid <emo> tags
    const restored = stripped.replace(/__EMO_(\d+)__/g, (_, i) => emoPlaceholders[Number(i)])

    // 5. Block links and URLs
    if (URL_REGEX.test(restored)) {
        return { ok: false, error: 'Bình luận không được chứa đường dẫn !' }
    }

    // 6. Block banned words (exclude <emo> parts from check)
    const textOnly = restored.replace(VALID_EMO_REGEX, '').toLowerCase()
    const foundWord = BANNED_WORDS.find(word => textOnly.includes(word))
    if (foundWord) {
        return { ok: false, error: 'Bình luận chứa từ ngữ không phù hợp !' }
    }

    return { ok: true, value: restored }
}