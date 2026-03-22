type TGetIdFromUrl = '/' | '-'

const getIdFromUrl = (url: string, type: TGetIdFromUrl) => {
    const parts = url.split(type).filter(Boolean);
    return parts[parts.length - 1] || '';
};

export default getIdFromUrl;