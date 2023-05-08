using System;

namespace HaberPortali.ViewModel
{
    public class CommentModel
    {
        public int commentId { get; set; }
        public int commentUserId { get; set; }
        public string commentContent { get; set; }
        public DateTime commentTime { get; set; }
        public int commentNewsId { get; set; }
        public int userId { get; set; }
        public string userName { get; set; }
        public string newsTitle { get; set; }
    }
}