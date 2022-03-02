<template>
  <div class="ml-auto wrap-menu-dropdown_my-course">
          <app-dropdown
            class="post__menu-dropdown"
            position="right"
            open-on-click
            v-model="menuDropdown"
            :content-width="'15rem'"
          >
            <button slot="activator" slot-scope="{ on }" v-on="on">
              <IconDots class="icon fill-gray" />
            </button>

            <ul class="link--dropdown__ElearningItem">
              <li class="item-share__ElearningItem" @click.prevent="shareDropdown=!shareDropdown">
                <n-link to>
                  <IconShare24px class="icon" />Chia sẻ
                </n-link>
                <ul class="share-dropdowm__ElearningItem" v-if="shareDropdown">
                  <li @click.prevent="shareFb(elearning.elearning_id)">
                    <a>
                      <IconFacebook class="icon fill-info"/>Chia sẻ qua Facebook
                      </a>
                  </li>
                  <li @click.prevent="shareSchool(elearning.elearning_id)">
                    <a>
                      <IconSchooly class="icon fill-white"/>Chia sẻ qua Schoolly
                      </a>
                  </li>
                </ul>
              </li>
              <li>
                <n-link to>
                  <IconCardsHeart class="icon" />Yêu thích
                </n-link>
              </li>
            </ul>
          </app-dropdown>
        </div>
</template>

<script>
import IconDots from "~/assets/svg/icons/dots.svg?inline";
import IconCardsHeart from "~/assets/svg/v2-icons/cards-heart.svg?inline";
import IconShare24px from "~/assets/svg/v2-icons/share_24px.svg?inline";
import IconFacebook from '~/assets/svg/design-icons/facebook.svg?inline';
import IconSchooly from '~/assets/svg/icons/schooly.svg?inline';
export default {
    components:{
        IconDots,
        IconCardsHeart,
        IconShare24px,
        IconFacebook,
        IconSchooly
    },
    data(){
        return{
            menuDropdown: false,
            shareDropdown:false
        }
    }
}
</script>

<style lang="scss">
.wrap-menu-dropdown_my-course{
    .app-dropdown__content{
        right: -10px !important;
        margin-top: 10px;
    }
    .link--dropdown__ElearningItem{
        list-style: none;
        padding:18px;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
        li{
            a{
                text-decoration: none;
                display: flex;
                align-items: center;
                color: #656565;
                svg{
                    margin-right: 10px;
                }
                &:hover{
                    color: $color-primary;
                }
            }
            .text-primary{
                &:hover{
                    color: #656565 !important;
                }
            }
        }
        li:nth-child(2){
            margin-top:28px;
        }
        .item-share__ElearningItem{
            .share-dropdowm__ElearningItem{
                list-style: none;
                text-decoration: none;
                position: absolute;
                right: -19.8rem;
                top: 0;
                background: white;
                padding:10px;
                box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
                li:nth-child(2){
                    margin: 10px 0 0;
                }
              }
        }
    }
}
</style>