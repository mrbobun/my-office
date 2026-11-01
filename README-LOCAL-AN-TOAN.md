# My Office · bản local-an-toan

Nhánh `local-an-toan` của fork `mrbobun/my-office`: giữ nguyên văn phòng 3D của tác giả (khanh020905/my-office), chỉ khoá những gì mở ra ngoài máy và làm việc cài đặt gọn hơn. Sửa ít để vẫn lấy bản mới của tác giả được.

## Khác bản gốc ở đâu

| | Bản gốc | Bản local-an-toan |
| --- | --- | --- |
| Mở cho điện thoại qua wifi | bật được bằng nút hoặc `--lan` | khoá, kể cả khi đặt `OFFICE_HOST` |
| Mở ra internet (Cloudflare tunnel) | bật được bằng nút | khoá |
| Tự tải chương trình `cloudflared` | có, không kiểm tra file | không bao giờ |
| Gửi chữ cho Google Dịch | bật khi chọn tiếng Việt | tắt |
| Hook duyệt quyền, trả lời câu hỏi | cài mặc định | chỉ khi `install --approve` |
| Status line, số liệu dùng (OpenTelemetry) sửa `settings.json` | cài mặc định | chỉ khi `--status`, `--otel` |
| Đồ hoạ | Auto (thường là Cao) | Auto bắt đầu ở Thấp, tự chọn cao hơn trong Cài đặt → Hiển thị |

Vì không có đường vào từ ngoài máy, mọi chức năng điện thoại (duyệt lệnh, giao việc, chen lời) cũng không dùng được.

Muốn mở lại có chủ ý: `OFFICE_OPEN=1` (wifi, tunnel), `OFFICE_TRANSLATE=1` (Google Dịch).

## Cài trên Mac

```bash
git clone -b local-an-toan https://github.com/mrbobun/my-office.git ~/Apps/my-office
cd ~/Apps/my-office
npm ci
node bin/cli.mjs install
node bin/cli.mjs start
```

Mở http://localhost:4310 (xem thử không cần phiên Claude: http://localhost:4310/?demo). Đổi tiếng Việt trong Cài đặt → Ngôn ngữ.

- `install` sao lưu `~/.claude/settings.json` rồi chỉ thêm các hook báo sự kiện và hook "ngắt vòng lặp kẹt" (bỏ hook này: `--no-loop-guard`). Hook của Sếp đang có được giữ nguyên.
- Không chạy nền khi đăng nhập. Tắt văn phòng: Ctrl+C ở cửa sổ đang chạy `start`.
- Gỡ hết: `node bin/cli.mjs uninstall`.
- Thẻ hạn mức gói Claude đọc token đăng nhập trong Keychain (macOS có thể hỏi một lần) và chỉ gửi tới api.anthropic.com. Không muốn: chạy `OFFICE_USAGE=0 node bin/cli.mjs start`.

## Lấy bản mới của tác giả

Tác giả đẩy code nhiều lần mỗi ngày. Trước khi gộp:

```bash
sh scripts/kiem-tra-cap-nhat.sh
```

Script chỉ đọc: liệt kê commit mới, file đổi và các dòng đáng soi (thư viện, hook, lệnh hệ thống, mạng, chỗ đã khoá). Đưa kết quả cho Claude soi, rồi mới `git merge upstream/main`.
