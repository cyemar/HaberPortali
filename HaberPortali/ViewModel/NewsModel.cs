using System;

namespace HaberPortali.ViewModel
{
    public class NewsModel
    {
        public int newsId { get; set; }
        public string newsTitle { get; set; }
        public string newsContent { get; set; }
        public string newsImage { get; set; }
        public DateTime newsDateTime { get; set; }
        public int newsCatId { get; set; }
        public int newsCreatedBy { get; set; }
    }
}