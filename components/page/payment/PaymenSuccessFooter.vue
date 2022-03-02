<template>
  <div class="contain wrap-footer__payment">
      <div class="row">
          <div class="col-md-4 row">
            <IconBubbleChart24px class="col-md-2"/>
            <div class="col-md-10">
                <strong>Chủ đề đa dạng</strong>
                <p class="mt-2">Schoolly cung cấp cho bạn kho bài giảng và tài liệu học tập phong phú.</p>
            </div>
        </div>
        <div class="col-md-4 row">
            <IconDevices24px class="col-md-2"/>
            <div class="col-md-10">
                <strong>Chủ đề đa dạng</strong>
                <p class="mt-2">Chỉ cần thiết bị có kết nối Internet bạn có thể học ở bất cứ nơi đâu, bất cứ khi nào.</p>
            </div>
        </div>
        <div class="col-md-4 row">
            <IconHourglassEmpty24px class="col-md-2"/>
            <div class="col-md-10">
                <strong>Chủ đề đa dạng</strong>
                <p class="mt-2">Schoolly giúp bạn rút ngắn 25 – 60% thời gian so với cách học truyền thống.</p>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import IconBubbleChart24px from '~/assets/svg/v2-icons/bubble_chart_24px.svg?inline';
import IconDevices24px from '~/assets/svg/v2-icons/devices_24px.svg?inline';
import IconHourglassEmpty24px from '~/assets/svg/v2-icons/hourglass_empty_24px.svg?inline';
export default {
    components:{
        IconBubbleChart24px,
        IconDevices24px,
        IconHourglassEmpty24px
    }
}
</script>

<style lang="scss">
.wrap-footer__payment{
    background: #F9F9F9;
    height: 130px;
    text-align:left;
    display: flex;
    align-items: center;
    padding-left: 25px;
    margin-top:6rem;
    svg {   
        height: 40px;
        width: 40px;
    }
    p{
        font-size: 1.3rem;
    }
}
</style>