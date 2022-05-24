<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            v-for="(item, i) in commentInfo.tags"
            :key="i"
            @click="changTags(i, item)"
            :class="{ active: commentInfoIndex === i }"
            >{{ item.title }}({{ item.tagCount }})</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        @click="changSortField(null)"
        :class="{ active: reqParams.sortField === null }"
        >默认</a
      >
      <a
        href="javascript:;"
        @click="changSortField('createTime')"
        :class="{ active: reqParams.sortField === 'createTime' }"
        >最新</a
      >
      <a
        href="javascript:;"
        @click="changSortField('praiseCount')"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        >最热</a
      >
    </div>
    <div class="list">
      <!-- 列表 -->
      <div class="list" v-if="commentList">
        <div class="item" v-for="(item, i) in commentList" :key="i">
          <div class="user">
            <img :src="item.member.avatar" alt="" />
            <span>{{ formatNickName(item.member.nickname) }} </span>
          </div>
          <div class="body">
            <div class="score">
              <i
                class="iconfont icon-wjx01"
                v-for="i in item.score"
                :key="i + 's'"
              ></i>
              <i
                class="iconfont icon-wjx02"
                v-for="i in 5 - item.score"
                :key="i + 'k'"
              ></i>

              <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
            </div>
            <div class="text">
              {{ item.content }}
              <!-- 图片预览 -->
              <GoodsCommentImage
                v-if="item.pictures.length"
                :pictures="item.pictures"
              ></GoodsCommentImage>
            </div>
            <div class="time">
              <span>{{ item.orderInfo.createTime }}</span>
              <span class="zan"
                ><i class="iconfont icon-dianzan"></i
                >{{ item.orderInfo.quantity }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <xtx-pagination
        :total="total"
        :currentPage="reqParams.page"
        @current-change="changePager"
      ></xtx-pagination>
    </div>
  </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { findCommentInfo, findCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup() {
    const goods = inject('goods')
    // 改变评价标签索引
    const commentInfoIndex = ref(0)
    const changTags = (index, item) => {
      commentInfoIndex.value = index
      if (item.type === 'img') {
        reqParams.tag = null
        // 改变评论显示的内容
        reqParams.hasPicture = true
      } else if (item.type === 'all') {
        // 显示所有的评论
        reqParams.hasPicture = false
        reqParams.tag = null
      } else {
        reqParams.tag = item.title
      }
      // 重置页码
      reqParams.page = 1
    }

    // 获取评价信息
    const commentInfo = ref([])
    const goodsCommentInfo = () => {
      findCommentInfo(goods.value.id).then((data) => {
        // 有图
        // type 的目的是将来点击可以区分点的是不是标签
        data.result.tags.unshift({
          type: 'img',
          title: '有图',
          tagCount: data.result.hasPictureCount
        })
        data.result.tags.unshift({
          type: 'all',
          title: '全部评价',
          tagCount: data.result.evaluateCount
        })
        commentInfo.value = data.result
      })
    }

    // 改变排序方式
    const changSortField = (sortField) => {
      reqParams.sortField = sortField
      // 重置页码
      reqParams.page = 1
    }

    // 获取评价列表
    const commentList = ref([])
    // 请求参数
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null, // 有没有图片
      tag: null, // 标签
      sortField: null // 排序方式
    })
    const goodsCommentList = () => {
      findCommentList(goods.value.id, reqParams).then((data) => {
        commentList.value = data.result.items
      })
    }

    // 拼接商品信息数据
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}: ${c.nameValue}`, '').trim()
    }

    // 处理用户名字信息
    const formatNickName = (Name) => {
      return Name.substr(0, 1) + '*****' + Name.substr(-1)
    }

    const total = ref(0)
    watch(
      reqParams,
      () => {
        goodsCommentList()
        // 记录总条数
        total.value = commentList.value.counts
      },
      { immediate: true }
    )

    // 改变分页函数
    const changePager = (np) => {
      reqParams.page = np
    }

    goodsCommentInfo()

    return {
      commentInfo,
      commentInfoIndex,
      goodsCommentInfo,
      goodsCommentList,
      changTags,
      commentList,
      reqParams,
      changSortField,
      formatSpecs,
      formatNickName,
      changePager
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}

.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
