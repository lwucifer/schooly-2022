<template>
  <div class="container wrapdepartmentfilterbar">
     <div class="d-flex flex-row align-items-center">
          <div class="department-filter__form__item">
            <app-button
            color="primary"
            class="department-filter__btn-submit"
            >
            <IconFilter />
            <span>Lọc kết quả thống kê</span>
            </app-button>
        </div>
        <div class="department-filter-select">
            <div>
                <app-vue-select
                placeholder="Theo xã/phường"
                />
            </div>
            <div>
                <app-vue-select
                placeholder="Theo cấp học"
                />
            </div>
            <div>
                <app-vue-select
                placeholder="Theo trường"
                />
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import IconFilter from "~/assets/svg/icons/filter.svg?inline"
export default {
    components:{
        IconFilter
    }
}
</script>

<style lang="scss">
.department-introduce{
    background: rgba(255, 202, 87, 0.1);
    padding:10px 19px;
    color: #333333;
   
}
.department-filter__btn-submit{
    border-radius: 100px;
    margin-right: 20px;
}
.department-filter-select{
    width: 100%;
    display: flex;
    >div{
        width: 161px;
        margin-right: 10px;
    }
}
.list-school-province{
    padding-top:30px;
    padding-bottom: 20px;
    font-size: 16px;
    line-height: 22px;;
}
.wrapdepartmentfilterbar{
    margin-top: 20px;
}
</style>