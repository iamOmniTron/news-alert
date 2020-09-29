module.exports = {
  truncate: function(string,len){
    if (string.length > len && string.length >0) {
      let newString = string+'';
      newString = string.substr(0,len);
      newString = string.substr(0,newString.lastIndexOf(' '))
      newString = newString.length>0? newString: string.substr(0,len)
      return newString+'...'
    }
    return string;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm,'');
  },
  editPost: function(author,currentUser,postId){
    if(author._id.toString() == currentUser.id.toString()){
      return `<a href="/api/posts/edit/${postId}" class="blue-text text-darken"> Edit</a`
    }
    return '';
  },
  deletePost: function(author,currentUser,postId){
    if (author._id.toString()== currentUser.id.toString()) {
      return`<a href="/api/posts/delete/${postId}" class="blue-text text-darken"> Delete</a`
    }
  }
}




























//
