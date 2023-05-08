using HaberPortali.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using HaberPortali.Models;

namespace HaberPortali.Controllers
{
    public class ServiceController : ApiController
    {
        Database1Entities1 db = new Database1Entities1();
        ResultModel result = new ResultModel();

        [HttpPost]
        [Route("api/login/{userMail}/{userPw}")]
        public ResultModel Login(string userMail, string userPw)
        {
            try
            {
                userModel user = db.userInfo.Where(x => x.userMail == userMail && x.userPw == userPw).Select(y => new userModel()
                {
                    userName = y.userName,
                    userPw = y.userPw,
                    userId = y.userId,
                    userMail = y.userMail,
                }).FirstOrDefault();

                if (user == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Wrong mail or password";
                    return result;
                }
                result.Success = true;
                result.ResultMessage = $"Login successfull, Welcome {user.userName}!";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPost]
        [Route("api/register/{userName}/{userMail}/{userPw}")]
        public ResultModel Register(string userName, string userMail, string userPw)
        {
            try
            {
                if (db.userInfo.Count(x => x.userMail == userMail) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already user registered with this mail";
                    return result;
                }

                userInfo user = new userInfo();

                user.userName = userName;
                user.userMail = userMail;
                user.userPw = userPw;

                db.userInfo.Add(user);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User added succesfully.";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPost]
        [Route("api/addComment/{newsId}/{userId}/{comment}")]
        public ResultModel AddComment(int newsId, int userId, string comment)
        {
            try
            {
                if (db.userInfo.FirstOrDefault(u => u.userId == userId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                if (db.comment.Count(x => x.comUserId == userId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "You cannot comment more than one";
                    return result;
                }
                if (db.newsInfo.FirstOrDefault(u => u.newsId == newsId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding news.";
                    return result;
                }

                comment m_comment = new comment();
                m_comment.comContent = comment;
                m_comment.comNewsId = newsId;
                m_comment.comUserId = userId;
                m_comment.comDate = DateTime.Now;

                db.comment.Add(m_comment);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Comment added.";

                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        #region User Stuff
        [HttpGet]
        [Route("api/userList")]
        public List<userModel> getUsers()
        {
            List<userModel> userList = db.userInfo.Select(x => new userModel()
            {
                userId = x.userId,
                userMail = x.userMail,
                userName = x.userName,
                userPw = x.userPw,
            }).ToList();
            return userList;

        }

        [HttpPost]
        [Route("api/addUser")]
        public ResultModel addUser(userModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.userInfo.Count(x => x.userId == model.userId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.userInfo.Count(x => x.userMail == model.userMail) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already user registered with this mail";
                    return result;
                }

                userInfo user = new userInfo();

                user.userId = model.userId;
                user.userName = model.userName;
                user.userMail = model.userMail;
                user.userPw = model.userPw;

                db.userInfo.Add(user);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }

        [HttpGet]
        [Route("api/userListById/{userId}")]
        public List<userModel> userListById(int userId)
        {
            List<userModel> list_ = db.userInfo.Where(x => x.userId == userId).Select(s => new userModel()
            {
                userId = s.userId,
                userMail = s.userMail,
                userName = s.userName,
                userPw = s.userPw
            }).ToList();
            return list_;
        }

        [HttpDelete]
        [Route("api/deleteUser/{userId}")]
        public ResultModel DeleteUser(int userId)
        {
            try
            {
                userInfo user = db.userInfo.Where(x => x.userId == userId).FirstOrDefault();

                if (user == null)
                {
                    result.Success = false;
                    result.ResultMessage = "User couldn't found";
                    return result;
                }
                db.userInfo.Remove(user);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPut]
        [Route("api/editUser")]
        public ResultModel EditUser(userModel model)
        {
            try
            {
                userInfo user = db.userInfo.Where(x => x.userId == model.userId).FirstOrDefault();
                if (user == null)
                {
                    result.Success = false;
                    result.ResultMessage = "User couldn't found";
                    return result;
                }

                user.userName = model.userName;
                user.userMail = model.userMail;
                user.userPw = model.userPw;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "User updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region Category stuff
        [HttpGet]
        [Route("api/listCategory")]
        public List<CategoryModel> getCategories()
        {
            List<CategoryModel> userList = db.category.Select(x => new CategoryModel()
            {
                catId = x.catId,
                catName = x.catName,
            }).ToList();
            return userList;
        }
        [HttpPost]
        [Route("api/addCategory")]
        public ResultModel AddCategory(CategoryModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.category.Count(x => x.catId == model.catId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.category.Count(x => x.catName == model.catName) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already a category that uses this name";
                    return result;
                }

                category category_ = new category();

                category_.catId = model.catId;
                category_.catName = model.catName;

                db.category.Add(category_);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }

        [HttpGet]
        [Route("api/catListById/{catId}")]
        public List<CategoryModel> catListById(int catId)
        {
            List<CategoryModel> list = db.category.Where(x => x.catId == catId).Select(s => new CategoryModel()
            {
                catId = s.catId,
                catName = s.catName,

            }).ToList();
            return list;
        }

        [HttpDelete]
        [Route("api/deleteCategory/{catId}")]
        public ResultModel DeleteCategory(int catId_)
        {
            try
            {
                category category = db.category.Where(x => x.catId == catId_).FirstOrDefault();

                if (category == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                if (db.newsInfo.Count(x => x.newsCatId == catId_) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is news in this category, clean news first";
                    return result;
                }

                db.category.Remove(category);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }

        [HttpPut]
        [Route("api/editCategory")]
        public ResultModel EditCategory(CategoryModel model)
        {
            try
            {
                category Category = db.category.Where(x => x.catId == model.catId).FirstOrDefault();
                if (Category == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }

                Category.catName = model.catName;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region News Stuff
        [HttpGet]
        [Route("api/listNews")]
        public List<NewsModel> getNews()
        {
            List<NewsModel> userList = db.newsInfo.Select(x => new NewsModel()
            {
                newsId = x.newsId,
                newsTitle = x.newsTitle,
                newsContent = x.newsContent,
                newsCreatedBy = x.newsCreatedBy,
                newsDateTime = x.newsDate,
                newsCatId = x.newsCatId,
                newsImage = x.newsImage
            }).ToList();
            return userList;
        }
        [HttpPost]
        [Route("api/addNews")]
        public ResultModel AddNews(NewsModel model)
        {
            try
            {
                if (model == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Invalid data inserted";
                    return result;
                }
                if (db.newsInfo.Count(x => x.newsId == model.newsId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "There is already same id in database";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.newsCreatedBy) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                newsInfo newsInfo = new newsInfo();

                newsInfo.newsId = model.newsId;
                newsInfo.newsTitle = model.newsTitle;
                newsInfo.newsContent = model.newsContent;
                newsInfo.newsCreatedBy = model.newsCreatedBy;
                newsInfo.newsCatId = model.newsCatId;
                newsInfo.newsDate = DateTime.Now;
                newsInfo.newsImage = model.newsImage;

                db.newsInfo.Add(newsInfo);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "News added succesfully.";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ResultMessage = ex.Message;
                return result;
            }
        }
        [HttpDelete]
        [Route("api/deleteNews/{newsId}")]
        public ResultModel DeleteNews(int newId_)
        {
            try
            {
                newsInfo news = db.newsInfo.Where(x => x.newsId == newId_).FirstOrDefault();

                if (news == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                db.newsInfo.Remove(news);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category deleted successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        [HttpGet]
        [Route("api/newsListById/{newsId}")]
        public List<NewsModel> newsListById(int newsId)
        {
            List<NewsModel> list = db.newsInfo.Where(x => x.newsId == newsId).Select(s => new NewsModel()
            {
                newsId = s.newsId,
                newsCatId = s.newsCatId,
                newsContent = s.newsContent,
                newsCreatedBy = s.newsCreatedBy,
                newsDateTime = s.newsDate,
                newsImage = s.newsImage,
                newsTitle = s.newsTitle
            }).ToList();
            return list;
        }

        [HttpPut]
        [Route("api/editNews")]
        public ResultModel EditNews(NewsModel model)
        {
            try
            {
                newsInfo news_ = db.newsInfo.Where(x => x.newsId == model.newsId).FirstOrDefault();
                if (news_ == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Category couldn't found";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.newsCreatedBy) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find Corresponding user.";
                    return result;
                }
                news_.newsTitle = model.newsTitle;
                news_.newsContent = model.newsContent;
                news_.newsCatId = model.newsCatId;
                news_.newsDate = model.newsDateTime;
                news_.newsCreatedBy = model.newsCreatedBy;
                news_.newsImage = model.newsImage;

                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Category updated successfully";
                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        #endregion

        #region Comment Stuff
        [HttpGet]
        [Route("api/listCommentsByNewsId/{newsId}")]
        public List<CommentModel> ListCommentsByNews(int newsId)
        {
            try
            {
                List<CommentModel> list = db.comment.Where(x => x.comNewsId == newsId).Select(y => new CommentModel()
                {
                    commentId = y.comId,
                    commentContent = y.comContent,
                    commentNewsId = y.comNewsId,
                    commentTime = y.comDate,
                    commentUserId = y.userInfo.userId,
                    userId = y.userInfo.userId,
                    userName = db.userInfo.Where(x => y.userInfo.userId == x.userId).FirstOrDefault().userName,
                    newsTitle = db.newsInfo.Where(x => y.newsInfo.newsId == x.newsId).FirstOrDefault().newsTitle,
                }).ToList();
                return list;
            }
            catch (Exception err)
            {
                Console.WriteLine(err.Message);
                return null;
            }
        }
        [HttpPost]
        [Route("api/addComment")]
        public ResultModel AddComment(CommentModel model)
        {
            try
            {
                if (db.comment.Count(x => x.comUserId == model.commentUserId) > 0)
                {
                    result.Success = false;
                    result.ResultMessage = "You cannot comment more than one";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.commentUserId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                if (db.newsInfo.FirstOrDefault(u => u.newsId == model.commentNewsId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding news.";
                    return result;
                }

                comment m_comment = new comment();
                m_comment.comId = model.commentId;
                m_comment.comContent = model.commentContent;
                m_comment.comNewsId = model.commentNewsId;
                m_comment.comUserId = model.commentUserId;
                m_comment.comDate = DateTime.Now;

                db.comment.Add(m_comment);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Comment added.";

                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        [HttpPut]
        [Route("api/editComment")]
        public ResultModel EditComment(CommentModel model)
        {
            try
            {
                comment com = db.comment.FirstOrDefault(x => x.comId == model.commentId);
                if (com == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Comment couldn't found.";
                    return result;
                }
                if (db.userInfo.FirstOrDefault(u => u.userId == model.commentUserId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding user.";
                    return result;
                }
                if (db.newsInfo.FirstOrDefault(u => u.newsId == model.commentNewsId) == null)
                {
                    result.Success = false;
                    result.ResultMessage = "Cannot find corresponding news.";
                    return result;
                }

                com.comId = model.commentId;
                com.comContent = model.commentContent;
                com.comNewsId = model.commentNewsId;
                com.comUserId = model.commentUserId;
                com.comDate = DateTime.Now;

                db.comment.Add(com);
                db.SaveChanges();

                result.Success = true;
                result.ResultMessage = "Comment edited.";

                return result;
            }
            catch (Exception err)
            {
                result.Success = false;
                result.ResultMessage = err.Message;
                return result;
            }
        }
        [HttpDelete]
        [Route("api/removeComment/{commentId}")]
        public ResultModel DeleteComment(int commentId)
        {
            comment com = db.comment.Where(x => x.comId == commentId).SingleOrDefault();
            if (com == null)
            {
                result.Success = false;
                result.ResultMessage = "Comment couldn't found.";
                return result;
            }

            db.comment.Remove(com);
            db.SaveChanges();

            result.Success = true;
            result.ResultMessage = "Comment removed.";
            return result;
        }

        #endregion
    }
}
