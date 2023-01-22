import { Component, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/service/conversation.service';
import { Message, Conversation } from 'src/app/model/Message';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(public cs: ConversationService) { }
  newMessage: string;
  ngOnInit() {
    this.messList.length = 0;
    this.initMessageList(this.fuid());
  }



  messList: Message[] = [];
  converList: Conversation[] = [];
  initMessageList(userId: any) {
    this.messList.length = 0;
    this.cs.getConversationBySenderId(this.fuid(), callback => {
      this.messList.length = 0;
      this.messList = callback
      this.messList.sort((a, b) => (a.sorttimestamp > b.sorttimestamp) ? 1 : ((b.sorttimestamp > a.sorttimestamp) ? -1 : 0));
      console.log(this.messList)
    });
  }

  sendMessage() {
    var userId = localStorage.getItem("authid");
    var createdMessage = new Message;
    createdMessage.content = this.newMessage;
    if (userId == null) return;
    createdMessage.senderId = userId;
    createdMessage.receiverId = "Admin";
    var date = new Date()
    createdMessage.sorttimestamp = date.getTime();
    var dateTime = date.getHours() + "." + date.getMinutes() + "\n, " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    createdMessage.timestamp = dateTime;
    this.addMessage(createdMessage)
  }
  addMessage(messageInstance: Message) {
    var uid = localStorage.getItem("authid");
    this.cs.addMessage(uid, messageInstance);
    this.initMessageList(uid)
  }
  /*
  listConversations() {
    var uid = localStorage.getItem("authid");
    this.cs.getConversations(uid, callback => {
      console.log(callback)
      this.converList = callback;
    });
  }
  */
  fuid() {
    var a = localStorage.getItem("authid");
    return a;
  }
}
