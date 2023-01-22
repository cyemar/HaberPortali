export class Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    sorttimestamp: number;
}
export class Conversation {
    userId: string;
    messages: Message[];
}