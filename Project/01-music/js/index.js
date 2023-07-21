// 思维：切入点【数据】
// console.log(lrc);//查看数据都是字符串
// 处理字符串---先将浏览器字符串变成对象

/**
 * 解析一个歌词字符串
 * 得到一个歌词数组
 * 每个歌词对象：
 *  {time:开始时间,words:歌词内容}
 */
function parseLrc() {
  // 首先将字符串变为数组
  var lines = lrc.split("\n");
  var result = [];
  for (var i = 0; i < lines.length; i++) {
    var str = lines[i];
    var parts = str.split("]"); //分割数组
    var timeStr = parts[0].substring(1); //截取数据
    //   遍历数组之后对其进行处理为对象
    var obj = {
      time: parseTimer(timeStr),
      words: parts[1],
    };
    //遍历每一个对象，并将对象遍历的数据添加到数组中
    result.push(obj);
  }
  return result;
}

/**
 * 将一个时间字符串变为数字（秒）【辅助函数】
 * @param {*} timeStr 时间字符串
 * @returns
 */
function parseTimer(timeStr) {
  var parts = timeStr.split(":");
  return +parts[0] * 60 + +parts[1]; //将第一个数据转为秒并加上分割的后面数据转为数字
}
//调用函数之后就会出现包含每个歌词时间和歌词的数组包含对象数据
var lrcData = parseLrc();

//获取需要的doms
var doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".container ul"),
  container: document.querySelector(".container"),
};

/**
 * 计算在当前情况下。在当前播放器播放到低级秒的情况
 * 在lrcData数组中，应该高亮显示下标
 * 遍历歌词数据如果当前时间小于遍历歌词的时间那么返回当前数值-1
 * 如果没有歌词显示则得到-1
 */
function findIndex() {
  var curTime = doms.audio.currentTime; //播放器当前时间
  for (var i = 0; i < lrcData.length; i++) {
    if (curTime < lrcData[i].time) {
      return i - 1;
    }
  }
  //循环结束都没有找到（说明是最后一句，应该显示最后一句）
  return lrcData.length - 1;
}

//界面
/**
 * 创建歌词元素li
 */
function craeatLrcElement() {
  var frag = document.createDocumentFragment(); //文档片段
  for (let i = 0; i < lrcData.length; i++) {
    //创建每一个歌词并创建li
    var li = document.createElement("li");
    li.textContent = lrcData[i].words;
    // doms.ul.appendChild(li); //改动dom树
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag); //优化：先添加到文档片段，再添加dom树
}
craeatLrcElement();

//容器高度
var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置ul偏移量
 */
function setOffset() {
  var index = findIndex();
  var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  // 边界判断
  if (offset < 0) {
    offset = 0;
  }
  if (offset > maxOffset) {
    offset = maxOffset;
  }
  doms.ul.style.transform = `translateY(-${offset}px)`;

  //去掉之前的active样式
  var li = doms.ul.querySelector(".active");
  if (li) {
    li.classList.remove("active");
  }
  li = doms.ul.children[index];
  if (li) {
    li.classList.add("active");
  }
}

doms.audio.addEventListener("timeupdate", setOffset);
// setOffset();
