import {CONFIG_API} from "@/configs/api";

export type TCommentPart =
    | { type: 'text'; value: string }
    | { type: 'image'; name: string; url: string }

export const parseComment = (content: string): TCommentPart[] => {
    const parts: TCommentPart[] = []
    const regex = /:([a-zA-Z0-9_ ]+):/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(content)) !== null) {
        // Phần text trước emoji
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                value: content.slice(lastIndex, match.index)
            })
        }

        // Phần emoji
        const emojiName = match[1].trim().replace(/\s+/g, '-').toLowerCase();
        parts.push({
            type: 'image',
            name: match[1],
            url: `${CONFIG_API.IMAGE.INDEX}/emoji-${emojiName}`
        })

        lastIndex = regex.lastIndex
    }

    // Phần text còn lại sau emoji cuối
    if (lastIndex < content.length) {
        parts.push({
            type: 'text',
            value: content.slice(lastIndex)
        })
    }

    return parts
}