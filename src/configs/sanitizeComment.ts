export const BANNED_WORDS: string[] = [
    'dm', 'đm', 'cc', 'cl', 'vl', 'đcm', 'dcm', 'vcl', 'vkl', 'wtf',
    'lồn', 'cặc', 'buồi', 'dái', 'âm hộ', 'dương vật',
    'địt', 'đụ', 'chịch', 'đéo', 'đếch',
    'mẹ kiếp', 'mẹ mày', 'má mày', 'mẹ cha mày',
    'đồ chó', 'con chó', 'con lợn', 'thằng chó', 'con điếm',
    'đồ khốn', 'thằng khốn', 'đồ ngu', 'thằng ngu', 'con ngu',
    'đồ óc chó', 'óc lợn', 'não cá vàng',
    'cút đi', 'biến đi', 'xéo đi',
    'đồ lgbt', 'pê đê', 'bê đê', 'thằng gay', 'con lesbian',
]

export const URL_REGEX = /(^|\s)(https?:\/\/[^\s]+|www\.[^\s]+|[\w\-]+\.(com|net|org|io|vn|co|me|tv|xyz|info|app|dev|page|site|link|click|live|online|store|shop)(\.[a-z]{2,})?(\/[^\s]*)?)/gi

// :name:
export const VALID_EMO_REGEX = /:[\w\- ]+:/g