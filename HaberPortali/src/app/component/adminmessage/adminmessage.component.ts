import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/model/Message';
import { ConversationService } from 'src/app/service/conversation.service';

@Component({
  selector: 'app-adminmessage',
  templateUrl: './adminmessage.component.html',
  styleUrls: ['./adminmessage.component.scss']
})
export class AdminmessageComponent implements OnInit {

  constructor(public cs: ConversationService) { }

  newMessage: string;
  messListt: Message[] = [];
  targetId: any;
  ngOnInit() {
    this.targetId = localStorage.getItem("targetId");
    this.getDmById(this.fuid());
  }
  getDmById(_targetID: string) {
    this.targetId = _targetID;
    this.messListt.length = 0;
    this.cs.getConversationBySenderIdAdmin(_targetID, callback => {
      this.messListt.length = 0;
      this.messListt = callback;
      this.messListt.sort((a, b) => (a.sorttimestamp > b.sorttimestamp) ? 1 : ((b.sorttimestamp > a.sorttimestamp) ? -1 : 0));
    });
  }
  sendMessage() {
    var userId = "Admin";
    var createdMessage = new Message;
    createdMessage.content = this.newMessage;
    if (this.fuid() == null) return;
    createdMessage.senderId = userId;
    createdMessage.receiverId = this.fuid();
    var date = new Date()
    createdMessage.sorttimestamp = date.getTime();
    var dateTime = date.getHours() + "." + date.getMinutes() + "\n, " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    createdMessage.timestamp = dateTime;
    this.addMessage(createdMessage)
  }
  addMessage(messageInstance: Message) {
    var uid = "Admin";
    this.cs.addMessage(uid, messageInstance);
    this.messListt = [];
    this.getDmById(this.targetId)
  }
  fuid() {
    return this.targetId;
  }
}
