<template>
  <el-dialog :visible.sync="show" title="详情" @close="$emit('close')">
    <el-tabs v-model="activeName" v-if="detail">
      <el-tab-pane name="postSale" label="售后信息" v-if="detail.postSale">
        <el-row v-if="detail && detail.postSale">
          <el-col class="section">基本信息</el-col>
          <infoItem title="用户备注" :content="detail.postSale.remark"></infoItem>
          <infoItem title="机器备注" :content="detail.postSale.merchantRemark"></infoItem>
          <infoItem title="状态" :content="detail.postSale.Status"></infoItem>
          <infoItem title="退款进度" :content="detail.order.PayStatus"></infoItem>

          <el-col class="section">订单信息</el-col>
          <infoItem title="订单号" :content="detail.order.no"></infoItem>
          <infoItem title="原价" :content="detail.order.price"></infoItem>
          <infoItem title="优惠价格" :content="detail.order.couponPrice"></infoItem>
          <infoItem title="订单价格" :content="detail.order.orderPrice"></infoItem>
          <infoItem title="支付时间" :content="detail.order.payTime"></infoItem>
          <infoItem title="下单时间" :content="detail.order.orderTime"></infoItem>
          <infoItem title="退款时间" :content="detail.order.refundTime"></infoItem>
          <infoItem title="订单状态" :content="detail.order.payState"></infoItem>
        </el-row>

        <div class="v-padding">
          机器地址：
          <a
            v-bind:href="'https://www.google.com/maps/search/?api=1&query='+detail.store.latitude+','+detail.store.longitude"
            target="_blank"
          >{{detail.store.address}}</a>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import infoItem from "./infoItem.vue";
export default {
  components: {
    infoItem
  },
  props: ["open", "id"],
  data() {
    return {
      activeName: "postSale",
      show: false,
      detail: null
    };
  },

  methods: {
    onLog(it) {
      let payState = {
        PAID: "已经支付",
        REFUNDING: "退款中",
        REFUND: "已退款"
      };
      it.order.payState = payState[it.order.payStatus];
    },
    getDetail() {
      let url = "order/post_sale/" + this.id;
      let vm = this;
      vm.startLoading();
      this.ax
        .get(url)
        .then(it => {
          vm.stopLoading();
          vm.onLog(it);
          vm.detail = it;
        })
        .catch(it => {
          vm.stopLoading();
          vm.error(it);
        });
    }
  },
  watch: {
    bargainId(val) {
      if (val) {
        this.getDetail();
      }
    },
    id(val) {
      if (val) {
        this.getDetail();
      }
    },
    open(val) {
      this.show = val;
    },
    show(val) {
      if (!val) {
      }
    }
  }
};
</script>
<style scoped>
.section {
  border-left: solid 5px #409eff;
  color: #409eff;
  padding: 0rem 0.2rem;
  margin: 0.4rem 0;
}

.v-padding {
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  color: #bbb;
}
.v-padding a {
  color: #1f2d3d;
}
</style>


