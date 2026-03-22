export const BANNED_WORDS: string[] = [
    // Viết tắt thô tục
    'dm', 'đm', 'cc', 'cl', 'vl', 'đcm', 'dcm', 'vcl', 'vkl', 'wtf',

    // Bộ phận sinh dục
    'lồn', 'cặc', 'buồi', 'dái', 'âm hộ', 'dương vật',

    // Hành động thô tục
    'địt', 'đụ', 'chịch', 'đéo', 'đếch',

    // Chửi thề
    'mẹ kiếp', 'mẹ mày', 'má mày', 'mẹ cha mày',
    'đồ chó', 'con chó', 'con lợn', 'thằng chó', 'con điếm',
    'đồ khốn', 'thằng khốn', 'đồ ngu', 'thằng ngu', 'con ngu',
    'đồ óc chó', 'óc lợn', 'não cá vàng',
    'cút đi', 'biến đi', 'xéo đi',

    // Kỳ thị
    'đồ lgbt', 'pê đê', 'bê đê', 'thằng gay', 'con lesbian',
]

// Regex to block links/URLs
export const URL_REGEX = /(^|\s)(https?:\/\/[^\s]+|www\.[^\s]+|[\w\-]+\.(com|net|org|io|vn|co|me|tv|xyz|info|app|dev|page|site|link|click|live|online|store|shop)(\.[a-z]{2,})?(\/[^\s]*)?)/gi

// Only allow valid <emo>filename.ext</emo> tags
export const VALID_EMO_REGEX = /<emo>[\w\-./]+\.(?:png|gif|webp|jpg)<\/emo>/g