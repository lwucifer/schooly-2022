<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-3">
                <PolicyManagerSide :setActive="1"/>
            </div>

            <div class="col-12 col-md-9">
                <div class="policy">
                    <h3 class="text-dark mb-5">CHÍNH SÁCH BẢO MẬT</h3>

                    <div class="policy__content">
                        <p class="text-primary font-weight-bold">1. Mục đích và phạm vi thu thập</p>
                        <p>• Việc thu thập dữ liệu chủ yếu trên Schoolly bao gồm: Tên đầy đủ, email, số điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ để thiết lập hồ sơ cá nhân. Đây là các thông tin bắt buộc cần thành viên cung cấp khi đăng ký tài khoản.</p>
                        <p>• Thành viên sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện tử của mình. Ngoài ra, thành viên có trách nhiệm thông báo kịp thời cho Ban quản lý Schoolly về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật, lưu giữ tên đăng ký và mật khẩu của bên thứ ba để có biện pháp giải quyết phù hợp.</p>
                        <p class="text-primary font-weight-bold">2. Phạm vi sử dụng thông tin</p>
                        <p>Chúng tôi sử dụng thông tin thành viên cung cấp để:</p>
                        <p>• Xác minh hồ sơ cá nhân tại Schoolly; gửi các thông báo về các hoạt động trao đổi thông tin giữa thành viên và Schoolly</p>
                        <p>• Ngăn ngừa các hoạt động phá hủy tài khoản của thành viên hoặc các hoạt động giả mạo thành viên;</p>
                        <p>• Liên hệ hỗ trợ thành viên khi mua bài giảng/khoá học trên trang. Xác nhận thông tin khi thực hiện mua hàng;</p>
                        <p>• Thực hiện các cuộc khảo sát; các hoạt động quảng bá, cung cấp các thông tin cập nhật về điều khoản hoạt động của Schoolly.</p>
                        <p>Ngoài ra, chúng tôi không sử dụng thông tin cá nhân mà thành viên đã cung cấp cho bất cứ mục đích nào khác;</p>
                        <p class="text-primary font-weight-bold">3. Thời gian lưu trữ thông tin</p>
                        <p>• Dữ liệu cá nhân của thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân của thành viên sẽ được bảo mật trên máy chủ của Schoolly.</p>
                        <p class="text-primary font-weight-bold">4. Những người hoặc tổ chức có thể được tiếp cận với thông tin đó</p>
                        <p>• Ban quản lý Schoolly và các bộ phận liên quan đến việc xác thực thông tin của các thành viên</p>
                        <p>• Trong trường hợp có yêu cầu của pháp luật: Chúng tôi có trách nhiệm hợp tác cung cấp thông tin thành viên khi có yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan công an điều tra liên quan đến hành vi vi phạm pháp luật nào đó của khách hàng. Ngoài ra, không ai có quyền xâm phạm vào thông tin cá nhân này.</p>
                        <p class="text-primary font-weight-bold">5. Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân </p>
                        <p>• Công ty Cổ Phần giáo dục Schoolly Việt Nam </p>
                        <p>• Tầng 4, Mỹ Sơn Tower, 62A Nguyễn Huy Tưởng, Phường Thanh Xuân Trung, Quận Thanh Xuân, TP. Hà Nội.</p>
                        <p>• Email: cskh@schoolly.vn</p>
                        <p>• Đối với các thắc mắc về hoạt động thu thập, xử lý thông tin liên quan đến cá nhân người tiêu dùng, khách hàng có thể liên hệ với chúng thôi thông qua email: cskh@schoolly.vn.</p>
                        <p class="text-primary font-weight-bold">6. Phương thức và công cụ để người tiêu dùng tiếp cận và chỉnh sửa dữ liệu cá nhân của mình</p>
                        <p>• Thành viên có quyền tự kiểm tra, cập nhật hoặc điều chỉnh thông tin cá nhân của mình bằng cách đăng nhập vào tài khoản đã được cấp trên Schoolly. Sau đó, chọn mục “Hồ sơ cá nhân” để thực hiện việc chỉnh sửa theo yêu cầu của người dùng.</p>
                        <p class="text-primary font-weight-bold">7. Cam kết bảo mật thông tin khách hàng</p>
                        <p>• Thông tin cá nhân của thành viên trên Schoolly được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của Schoolly. Việc thu thập và sử dụng thông tin của mỗi thành viên chỉ được thực hiện khi có sự đồng ý của khách hàng đó trừ những trường hợp pháp luật có quy định khác</p>
                        <p>• Không sử dụng, không chuyển giao cho bên thứ 3 nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng ý từ thành viên</p>
                        <p>• Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân thành viên, Schoolly sẽ có trách nhiệm thông báo vụ việc cho cơ quan chức năng điều tra xử lý kịp thời và thông báo cho thành viên được biết</p>
                        <p>• Ban quản lý Schoolly yêu cầu các cá nhân khi đăng ký là thành viên, phải cung cấp đầy đủ thông tin cá nhân có liên quan như: Họ và tên, địa chỉ liên lạc, email, số chứng minh nhân dân, điện thoại,…và chịu trách nhiệm về tính pháp lý của những thông tin trên. Ban quản lý Schoolly không chịu trách nhiệm cũng như không giải quyết mọi khiếu nại có liên quan đến quyền lợi của thành viên đó nếu xét thấy tất cả thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban đầu là không chính xác.</p>
                        <p>• Nếu sử dụng các thiết bị có kết nối internet chung nhiều người, thành viên nên đăng xuất hoặc thoát hết tất cả cửa sổ Website đang mở. </p>
                        <p>• Trong trường hợp phát sinh các lỗi kỹ thuật hoặc bị tấn công dữ liệu, Ban quản lý Schoolly có trách nhiệm thông báo cho cơ quan chức năng và thành viên trong thời gian 03 ngày kể từ khi có sự cố xảy ra.</p>
                        <p class="text-primary font-weight-bold">8. Cơ chế tiếp nhận và giải quyết khiếu nại liên quan đến việc thông tin cá nhân khách hàng</p>
                        <p>• Khi phát hiện thông tin cá nhân của mình bị sử dụng sai mục đích hoặc phạm vi, thành viên có thể cung cấp các thông tin, chứng cứ liên quan đến việc này theo địa chỉ:</p>
                        <p class="font-weight-bold">• Công ty Cổ Phần giáo dục Schoolly Việt Nam</p>
                        <p>• Tầng 4, Mỹ Sơn Tower, 62A Nguyễn Huy Tưởng, Phường Thanh Xuân Trung, Quận Thanh Xuân, TP. Hà Nội.</p>
                        <p>• Hoặc qua Email: cskh@schoolly.vn</p>
                        <p>• Trong thời hạn 10 ngày làm việc kể từ ngày nhận được khiếu nại của thành viên, Bộ phận/đơn vị chủ trì giải quyết khiếu nại có trách nhiệm tìm ra nguyên nhân khiếu nại và đưa ra phương án giải quyết. Trả lời cho thành viên về kết quả giải quyết khiếu nại. Tùy theo mức độ, tính chất của việc khiếu nại mà Bộ phận/đơn vị chủ trì giải quyết khiếu nại sẽ có biện pháp giải quyết cụ thể.</p>
                        <p>• Nếu thông qua hình thức thỏa thuận mà vẫn không thể giải quyết được khiếu nại của thành viên thì một trong hai bên sẽ có quyền nhờ đến cơ quan pháp luật có thẩm quyền can thiệp nhằm đảm bảo lợi ích hợp pháp của các bên.</p>
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