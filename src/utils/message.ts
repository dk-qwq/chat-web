import type { Message } from "@/type/message";

export function mergeMessages(list1: Message[] | null | undefined, list2: Message[] | null | undefined): Message[] {
    if (!list1 || !list2) {
        return list1 ?? list2 ?? []
    }

    const map = new Map<number, Message>()

    for (const msg of list1)
        map.set(msg.id, msg)
    for (const msg of list2)
        map.set(msg.id, msg)

    return Array.from(map.values()).sort((a, b) => {
        return a.id - b.id;
    })
}

export function formatTimestamp(timestamp: number): string {
    const messageDate = new Date(timestamp);
    const now = new Date();

    if (Number.isNaN(messageDate.getTime())) {
        return "";
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    const timeString = messageDate.toLocaleTimeString("zh-CN", timeOptions);

    if (messageDate >= today) {
        return timeString;
    } else if (messageDate >= yesterday) {
        return `昨天 ${timeString}`;
    } else if (messageDate >= oneWeekAgo) {
        const weekday = messageDate.toLocaleDateString("zh-CN", {
            weekday: "long",
        });
        return `${weekday} ${timeString}`;
    } else if (messageDate.getFullYear() === now.getFullYear()) {
        return messageDate.toLocaleDateString("zh-CN", {
            month: "numeric",
            day: "numeric",
        });
    } else {
        return messageDate.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
    }
}