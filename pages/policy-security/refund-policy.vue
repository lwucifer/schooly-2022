<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-3">
                <PolicyManagerSide :setActive="3"/>
            </div>

            <div class="col-12 col-md-9">
                <div class="policy">
                    <h3 class="text-dark mb-5">CHÍNH SÁCH HOÀN TIỀN</h3>

                    <div class="policy__content">
                        <p>Schoolly trân trọng sự tin tưởng và ủng hộ của học viên khi đặt mua các bài giảng/khoá học(BG/KH) trên trang Schoolly.vn. Chúng tôi luôn mong muốn mang đến cho bạn những giờ học thú vị, những BG/KH chất lượng đi kèm dịch vụ tốt. Cam kết hoàn tiền trong trong trường hợp khách hàng không hài lòng về BG/KH của Schoolly.</p>
                        <p>Schoolly cung cấp dịch vụ trực tuyến, thông tin đăng ký và xác minh tài khoản được hoàn thành trên Ứng dụng/Website và trao đổi trực tiếp qua email, số điện thoại.</p>
                        <p>Chính sách hoàn tiền dưới đây có hiệu lực từ ngày 24/6/2020.</p>
                        <p class="text-primary font-weight-bold">1. Điều kiện áp dụng hoàn tiền</p>
                        <p>• Theo các điều khoản và điều kiện được quy định trong Chính Sách Hoàn Tiền này, Schoolly cho phép khách hàng gửi yêu cầu hoàn tiền trước khi hết hạn. Thời gian yêu cầu không quá 15 ngày kể từ ngày thanh toán.</p>
                        <p class="font-weight-bold">Điều kiện xét lý do hoàn tiền:</p>
                        <p>• Các lỗi kỹ thuật liên quan đến BG/KH phát sinh do Schoolly như file, tài liệu sau khi mua bị lỗi không mở, không xem được,…</p>
                        <p>• Lỗi thanh toán: Thanh toán thừa, thanh toán trùng đơn hàng;</p>
                        <p>• Khách hàng đã thanh toán nhưng chưa nhận được BG/KH;</p>
                        <p>• Các lý do khác do phía Schoolly phê duyệt.</p>
                        <p><i>*Lưu ý:</i></p>
                        <p>• Tất cả các lý do hoàn tiền đều phải được chứng minh bằng hình ảnh trước khi gửi email.</p>
                        <p>• Schoolly luôn xem xét cẩn thận từng yêu cầu hoàn tiền và giữ toàn quyền trong quyết định hoàn tiền cho khách hàng.</p>
                        <p class="font-weight-bold">Schoolly KHÔNG hoàn tiền trong các trường hợp sau:</p>
                        <p>• Học viên không thích, không muốn học nữa (Ví dụ: Không thấy hay, không thấy phù hợp nên muốn hoàn tiền…)</p>
                        <p>• Nhầm lẫn (Ví dụ: Xem quảng cáo BG/KH tương tự của Website khác nhưng đặt mua trên Schoolly…)</p>
                        <p>• Lỗi từ thiết bị học tập của học viên: Trong quá trình học, nếu học viên gặp các lỗi kĩ thuật khách quan (máy tính/điện thoại hỏng, đường truyền interrnet không kết nối, trình duyệt cũ không học được….)</p>
                        <p>• Không đọc kỹ thông tin: Trước khi tiến hành thanh toán, bạn nên đọc kỹ thông tin phần giới thiệu BG/KH để chọn mua cho mình khoá học phù hợp.</p>
                        <p>• Trường hợp học viên mua BG/KH của Schoolly theo hình thức nhờ mua hộ, mua qua bên thứ 3 như tổ chức/cá nhân khác mà không chứng minh được đã thanh toán cho Schoolly, bạn vui lòng liên hệ với bên mà mình đã thanh toán để được hoàn tiền.</p>
                        <p class="text-primary font-weight-bold">2. Thời gian hoàn tiền</p>
                        <p>• Hình thức thanh toán khi mua các BG/KH trên Schoolly là thanh toán online (bao gồm thanh toán chuyển khoản ngân hàng; thanh toán qua thẻ visa/mastercard; thanh toán qua thẻ ATM nội địa Việt Nam…). Thời gian hoàn tiền trong vòng 15 ngày kể từ lúc yêu cầu hoàn tiền được phê duyệt.</p>
                        <p class="text-primary font-weight-bold">3. Cách thức hoàn tiền và số tiền được hoàn trả</p>
                        <p>• Schoolly thực hiện hình thức hoàn tiền duy nhất là Chuyển Khoản Ngân Hàng. Do đó, khi yêu cầu hoàn tiền quý khách phải cung cấp số tài khoản ngân hàng nhận tiền cho Schoolly.</p>
                        <p>• Phí chuyển khoản phát sinh do khách hàng chịu (tùy thuộc vào ngân hàng nhận, phí chuyển khoản sẽ khác nhau, miễn phí hoặc có phí).</p>
                        <p class="font-weight-bold">Số tiền KH được hoàn trả = Số tiền Schoolly nhận được - Phí chuyển khoản</p>
                        <p class="text-primary font-weight-bold">4. Xác thực thông tin khi hoàn tiền</p>
                        <p>• Để đảm bảo tính bảo mật cho khách hàng khi hoàn tiền, Schoolly sẽ tiến hành xác thực thông tin của quý khách hàng. Khách hàng phải dùng Email đã đăng ký với Schoolly để gửi thông tin yêu cầu hoàn tiền. Tên BG/KH yêu cầu hoàn tiền, Email đăng ký trên hệ thống phải trùng khớp nhau.</p>
                        <p class="text-primary font-weight-bold">5. Quy trình hoàn tiền</p>
                        <p>• Khách hàng gửi yêu cầu hoàn tiền tại đường dẫn <a href="https://hotro.schoolly.vn/hc/vi-vn/requests/new"  target="_blank">https://hotro.schoolly.vn/hc/vi-vn/requests/new</a> và cung cấp các thông tin theo yêu cầu. Sau khi xem xét các điều kiện hoàn tiền, Schoolly sẽ thông báo lại cho khách hàng thời gian hoàn tiền cụ thể thông qua email.</p>
                        <p>• Nếu quý khách hàng không thao tác được hoặc cần hỗ trợ thêm về Chính Sách Hoàn Tiền này vui lòng liên hệ với chúng tôi thông qua email <a class="font-weight-bold" href="mailto:cskh@schoolly.vn">cskh@schoolly.vn</a> để được hỗ trợ.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PolicyManagerSide from "~/components/page/policy-security/PolicyManagerSide";

export default {
    components: {
        PolicyManagerSide
    }
}
</script>

<style lang="scss">
@import "~assets/scss/pages/policy-security/_policy-security.scss";
</style>