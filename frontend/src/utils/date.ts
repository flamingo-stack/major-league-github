export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateRelative = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    if (diffInSeconds < 2592000) { // 30 days
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    if (diffInSeconds < 31536000) { // 365 days
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months === 1 ? '' : 's'} ago`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years === 1 ? '' : 's'} ago`;
}; 