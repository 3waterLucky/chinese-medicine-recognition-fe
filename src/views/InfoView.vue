<template>
  <div class="container">
    <ul @click="centerDialogVisible = true">
      <li v-for="(name, index) in temp" :key="index">{{ name }}</li>
    </ul>
    <el-pagination class="pagination" background layout="prev, pager, next" :total="163" />
    <!-- <el-descriptions
    title="Vertical list with border"
    direction="vertical"
    :column="4"
    :size="size"
    border
  >
    <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
    <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place" :span="2">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions> -->
  <el-dialog
    class="dialog"
    v-model="centerDialogVisible"
    title="详细信息"
    align-center
    width="80vw"
  >
    <el-descriptions
      class="list"
      direction="vertical"
      :column="4"
      size="default"
      border
    >
      <el-descriptions-item label="图片" :span="2">
        <img src="D:\Desktop\AI\中草药(中药材)数据集\test\test\天冬\tiandong_0039.jpg" alt="">
      </el-descriptions-item>
      <el-descriptions-item label="名称">天冬</el-descriptions-item>
      <el-descriptions-item label="原形态">
        攀援状多年生草本。茎细，有纵槽纹。叶状枝2～3枚簇生叶腋，线形，扁平，长1～3cm，宽1mm左右，叶退化为鳞片，主茎上的鳞状叶常变为下弯的短刺。花1～3朵簇生叶腋，黄白色或白色；花被片6；雌蕊1,子房3室。浆果球形，熟时红色。花期5月。
      </el-descriptions-item>
      <el-descriptions-item label="拼音">Tiān Dōnɡ</el-descriptions-item>
      <el-descriptions-item label="别名">大当门根</el-descriptions-item>
      <el-descriptions-item label="来源">
        为百合科植物天冬的根茎。秋、冬季采挖，除去须根人沸水中煮或蒸，除去外皮，微火烘干或用硫磺熏后再烘干。
      </el-descriptions-item>
      <el-descriptions-item label="生境分布">
        生于山野，亦栽培于庭园。分布我国中部、西北、长江流域及南方各地。
      </el-descriptions-item>
      <el-descriptions-item label="性味归经">
        性寒，味甘、苦。
      </el-descriptions-item>
      <el-descriptions-item label="功能主治">
        养阴生津，清热润肺，滋阴润肺，清心安神。用于肺燥干咳，虚劳咳嗽，津伤口渴，心烦失眠，内热消渴，肠燥便秘，白喉。
      </el-descriptions-item>
      <el-descriptions-item label="用法用量">
        内服：煎汤，3～9g；或入丸、散。外用：适量，研末敷患处。
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false" color="#f5a623" style="color: #fff">添加收藏</el-button>
        <el-button @click="centerDialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const centerDialogVisible = ref(false)

const obj = {
  "sanqi": "三七",
  "dancan": "丹参",
  "wumei": "乌梅",
  "wujiapi": "五加皮",
  "wuweizi": "五味子",
  "wulingzhi": "五灵脂",
  "rencan": "人参",
  "rencanqiepian": "人参切片",
  "xianhecao": "仙鹤草",
  "heshouwu": "何首乌",
  "foshou": "佛手",
  "peilan": "佩兰",
  "cebaiye": "侧柏叶",
  "jiangcan": "僵蚕",
  "dangcan": "党参",
  "quanxie": "全蝎",
  "juemingzi": "决明子",
  "cishi": "刺史",
  "qianhu": "前胡",
  "beishacankuai": "北沙参块",
  "beishacantiao": "北沙参条",
  "shengma": "升麻",
  "banxia": "半夏",
  "houpu": "厚朴",
  "hehuanpi": "合欢皮",
  "tubiechong": "土鳖虫",
  "diyu": "地榆",
  "digupi": "地骨皮",
  "dilong": "地龙",
  "mohanlian": "墨旱莲",
  "xiakucao": "夏枯草",
  "dafupi": "大腹皮",
  "daxieteng": "大血藤",
  "daqingye": "大青叶",
  "tiandong": "天冬",
  "tiannanxing": "天南星",
  "tiankuizi": "天葵子",
  "tianmakuai": "天麻块",
  "tianmapian": "天麻片",
  "nvzhenzi": "女贞子",
  "jianghuang": "姜黄",
  "shegan": "射干",
  "xiaohuixiang": "小茴香",
  "shanzha": "山楂",
  "shanzhuyu": "山茱萸",
  "shanyao": "山药",
  "bajitian": "巴戟天",
  "ganjiang": "干姜",
  "muxiang": "木香",
  "duzhong": "杜仲",
  "banlangen": "板蓝根",
  "zhiketiao": "枳壳条",
  "zhikepian": "枳壳片",
  "zhishi": "枳实",
  "juqizi": "枸杞子",
  "baiziren": "柏子仁",
  "chaihu": "柴胡",
  "taoren": "桃仁",
  "sangzhen": "桑椹",
  "sangpiaoxiao": "桑螵蛸",
  "huaihua": "槐花",
  "shuiniujiao": "水牛角",
  "shuihonghuazi": "水红花子",
  "chenxiang": "沉香",
  "zelan": "泽兰",
  "zhebeimu": "浙贝母",
  "huomaren": "火麻仁",
  "lingzhi": "灵芝",
  "paojiang": "炮姜",
  "niuxi": "牛膝",
  "mudanpi": "牡丹皮",
  "muli": "牡蛎",
  "yuzhutiao": "玉竹条",
  "yuzhupian": "玉竹片",
  "zhenzhumu": "珍珠母",
  "gancao": "甘草",
  "baitouweng": "白头翁",
  "baibiandou": "白扁豆",
  "baishu": "白术",
  "baifan": "白矾",
  "baishao": "白芍",
  "baihuasheshecao": "白花蛇舌草",
  "baimaogen": "白茅根",
  "baikou": "白蔻",
  "baihe": "百合",
  "baibu": "百部",
  "yimucao": "益母草",
  "zhimu": "知母",
  "shihu": "石斛",
  "shigao": "石膏",
  "shichangpu": "石菖蒲",
  "sharen": "砂仁",
  "shenqu": "神曲",
  "chuanshanjia": "穿山甲",
  "chuanxinlian": "穿心莲",
  "zhuru": "竹茹",
  "zihuadiding": "紫花地丁",
  "zicao": "紫草",
  "ziwan": "紫菀",
  "honghua": "红花",
  "hongkou": "红蔻",
  "xixin": "细辛",
  "luoshiteng": "络石藤",
  "xuduan": "续断",
  "luohanguo": "罗汉果",
  "qianghuo": "羌活",
  "rougui": "肉桂",
  "roucongronggen": "肉苁蓉根",
  "roucongrongpian": "肉苁蓉片",
  "roudoukou": "肉豆蔻",
  "aiye": "艾叶",
  "cangshu": "苍术",
  "kucan": "苦参",
  "fuling": "茯苓",
  "yinchen": "茵陈",
  "jingjie": "荆芥",
  "caokou": "草寇",
  "caoguo": "草果",
  "lizhihe": "荔枝核",
  "laifuzi": "莱菔子",
  "lianzixin": "莲子心",
  "tusizi": "菟丝子",
  "gegen": "葛根",
  "pugongying": "蒲公英",
  "puhuang": "蒲黄",
  "yiyiren": "薏苡仁",
  "huzhang": "虎杖",
  "chongcao": "虫草",
  "shechuangzi": "蛇床子",
  "chantui": "蝉蜕",
  "fupenzi": "覆盆子",
  "guya": "谷芽",
  "guanzhong": "贯众",
  "chishizhi": "赤石脂",
  "chishao": "赤芍",
  "lulutong": "路路通",
  "xinyi": "辛夷",
  "yuanzhi": "远志",
  "lianqiao": "连翘",
  "tongcao": "通草",
  "yujin": "郁金",
  "suanzaoren": "酸枣仁",
  "yejuhua": "野菊花",
  "jinqiancao": "金钱草",
  "jinyinhua": "金银花",
  "gouteng": "钩藤",
  "fangfeng": "防风",
  "ajiao": "阿胶",
  "fuzi": "附子",
  "chenpi": "陈皮",
  "qinghao": "青蒿",
  "shouwutengkuai": "首乌藤块",
  "shouwutengpian": "首乌藤片",
  "xiangfu": "香附",
  "biejia": "鳖甲",
  "jineijin": "鸡内金",
  "jixieteng": "鸡血藤",
  "maidong": "麦冬",
  "maiya": "麦芽",
  "huangbai": "黄柏",
  "huangjing": "黄精",
  "huangqin": "黄芩",
  "longgu": "龙骨"
}
const names = Object.values(obj)
const temp = names.slice(0, 10)
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

ul {
  width: 50%;
  
  li {
    height: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #c2c4ec;
    border-radius: 0.8vh;
    margin: 1vh;
  }
}

.pagination {
  margin-top: 2vh;
}
</style>