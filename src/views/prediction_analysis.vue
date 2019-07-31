<template>
  <div class="report-page">
    <div class="report-page-card">
      <div style="text-align: center">
        <div v-for="(item,index) in data" :key="index" style="float: left">
          <div class="wrapper">
            <div class="text-center">
              <p class="font-size-19 my-0">{{item}}</p>
              <p class="font-size-19 my-8">Mon</p>
              <img class="report-predict-weather"
                   src="https://cdn.heweather.com/cond_icon/100.png" alt/>
            </div>
            <div class="text-left mt-20">
              <p class="my-0 font-size-21">进店流量</p>
              <p class="mb-0 mt-5 font-size-24">354</p>
              <p class="spot my-0">预测结果(人数)</p>
              <p class="mb-0 mt-5 font-size-24">
                6.3%
                <img src="http://app.skyrec.cn/static/img/arrow_down.svg" alt/>
              </p>
              <p class="spot my-0">与上周比较</p>
            </div>
            <div class="text-left mb-0">
              <p class="my-0 font-size-21">阴天</p>
              <p class="spot my-0">天气</p>
              <p class="mb-0 mt-5 font-size-16">
                29~34℃
              </p>
              <p class="spot my-0">温度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: ['07/29', '07/30', '07/31', '08/01', '08/02', '08/03', '08/04']
    }
  }
}
</script>

<style scoped>
  .wrapper {
    height: 100%;
    width: 135px;
    padding: 14px 0;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
  }

  .report-predict-weather {
    width: 72px;
    height: 72px;
  }

  .spot {
    font-size: 12px;
    color: grey;
    opacity: 0.6;
  }

  .my-0 {
    margin-bottom: 0;
    margin-top: 0;
  }

  .mb-0 {
    margin-bottom: 0 !important;
  }

  .mt-5 {
    margin-top: 5px;
  }

  .my-8 {
    margin-bottom: 8px;
    margin-top: 8px;
  }

  .font-size-16 {
    font-size: 16px;
  }

  .font-size-19 {
    font-size: 19px;
  }

  .font-size-21 {
    font-size: 21px;
  }

  .font-size-24 {
    font-size: 24px;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
    padding-left: 15px;
    margin-bottom: 40px;
  }

  .mt-20 {
    margin-top: 20px;
  }
</style>
