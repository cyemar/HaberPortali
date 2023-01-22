import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Message, Conversation } from '../model/Message';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private db: AngularFireDatabase) { }

  ngOnInIt() {
  }

  getConversations(senderId: any, callback: (conversations: Conversation[]) => void) {
    const conversations: Conversation[] = [];
    this.db.database.ref('conversations').on('value', snapshot => {
      const allConversations = snapshot.val();
      Object.keys(allConversations).forEach(conversationKey => {
        const conversations_ = allConversations[conversationKey];
        if (allConversations[conversationKey].uid == senderId) {
          conversations.push(conversations_);
        }
      });
      callback(conversations);
    });
  }
  getConversationBySenderId(senderId: any, callback: (filteredMessages: Message[]) => void) {
    var a = localStorage.getItem("authid");
    const filteredMessages: Message[] = [];
    this.db.database.ref('conversations').on('value', snapshot => {
      const allConversations = snapshot.val();
      if (allConversations != undefined || allConversations != null) {
        Object.keys(allConversations).forEach(conversationKey => {
          const messages = allConversations[conversationKey].messages;
          if (messages != undefined || messages != null) {
            Object.keys(messages).forEach(messageKey => {
              if (messages[messageKey].senderId == a || messages[messageKey].receiverId == a || messages[messageKey].receiverId == "EVERYONE") {
                filteredMessages.push(messages[messageKey]);
              }
            });
          }
        });
        callback(filteredMessages);
      }
    });
  }
  getConversationBySenderIdAdmin(senderId: any, callback: (filteredMessages: Message[]) => void) {
    const filteredMessages: Message[] = [];
    this.db.database.ref('conversations').on('value', snapshot => {
      const allConversations = snapshot.val();
      if (allConversations != undefined || allConversations != null) {
        Object.keys(allConversations).forEach(conversationKey => {
          const messages = allConversations[conversationKey].messages;
          if (messages != undefined || messages != null) {
            Object.keys(messages).forEach(messageKey => {
              if (messages[messageKey].senderId == senderId || messages[messageKey].receiverId == senderId || messages[messageKey].receiverId == "EVERYONE") {
                filteredMessages.push(messages[messageKey]);
              }
            });
          }
        });
        callback(filteredMessages);
      }
    });
  }
  addMessage(conversationId: any, message: Message) {
    const messageRef = this.db.list<Message>(`conversations/${conversationId}/messages`).push(message);
    this.db.database.ref('conversations/' + conversationId + "/uid").set(conversationId);
    return messageRef;
  }
}
