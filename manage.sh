#!/bin/bash
# Quartz 사이트 폴더 관리 & 배포 인터페이스

VAULT="/Users/dunet/Documents/SylverObsidian"
QUARTZ="$HOME/quartz-site"
CONFIG="$QUARTZ/folders.conf"
SYNC="$QUARTZ/sync-obsidian.sh"

# sync-obsidian.sh를 folders.conf 기준으로 재생성
generate_sync() {
    cat > "$SYNC" << 'HEADER'
#!/bin/bash
VAULT="/Users/dunet/Documents/SylverObsidian"
QUARTZ_CONTENT="$HOME/quartz-site/content"
echo "🔄 동기화 시작..."
HEADER

    while IFS='|' read -r vault_rel content_name || [[ -n "$vault_rel" ]]; do
        [[ -z "$vault_rel" ]] && continue
        echo "rm -rf \"\$QUARTZ_CONTENT/$content_name\"" >> "$SYNC"
    done < "$CONFIG"

    while IFS='|' read -r vault_rel content_name || [[ -n "$vault_rel" ]]; do
        [[ -z "$vault_rel" ]] && continue
        cat >> "$SYNC" << EOF
cp -r "$VAULT/$vault_rel" "\$QUARTZ_CONTENT/$content_name"
echo "✅ $content_name 복사 완료"
EOF
    done < "$CONFIG"

    echo 'echo "📁 동기화 완료" && ls -la "$QUARTZ_CONTENT"' >> "$SYNC"
    chmod +x "$SYNC"
}

# 현재 폴더 목록 표시
show_folders() {
    echo ""
    echo "📂 현재 게시 중인 폴더"
    echo "────────────────────────────────────────────"
    local i=1
    while IFS='|' read -r vault_rel content_name || [[ -n "$vault_rel" ]]; do
        [[ -z "$vault_rel" ]] && continue
        printf "  [%d] %-15s  ←  %s\n" "$i" "$content_name" "$VAULT/$vault_rel"
        i=$((i+1))
    done < "$CONFIG"
    echo "────────────────────────────────────────────"
    echo ""
}

# 폴더 추가
add_folder() {
    echo ""
    echo "옵시디언 볼트 루트: $VAULT"
    echo "추가할 폴더의 상대 경로를 입력하세요."
    echo "예) 100.리소스/읽기목록"
    read -p "경로: " vault_rel

    if [ -z "$vault_rel" ]; then
        echo "❌ 경로를 입력해주세요."
        return
    fi

    if [ ! -d "$VAULT/$vault_rel" ]; then
        echo "❌ 폴더를 찾을 수 없습니다: $VAULT/$vault_rel"
        return
    fi

    default_name=$(basename "$vault_rel")
    read -p "웹사이트에 표시될 이름 (기본값: $default_name): " content_name
    content_name=${content_name:-$default_name}

    # 중복 확인
    if grep -q "|$content_name$" "$CONFIG" 2>/dev/null; then
        echo "❌ 이미 '$content_name' 이름이 존재합니다."
        return
    fi

    echo "$vault_rel|$content_name" >> "$CONFIG"
    echo "✅ 추가됨: $content_name  ($VAULT/$vault_rel)"
}

# 폴더 제거
remove_folder() {
    show_folders
    local total
    total=$(grep -c . "$CONFIG" 2>/dev/null || echo 0)

    if [ "$total" -eq 0 ]; then
        echo "제거할 폴더가 없습니다."
        return
    fi

    read -p "제거할 번호 (취소: 0): " num

    if [[ "$num" == "0" ]]; then return; fi

    if ! [[ "$num" =~ ^[0-9]+$ ]] || [ "$num" -lt 1 ] || [ "$num" -gt "$total" ]; then
        echo "❌ 잘못된 번호"
        return
    fi

    local removed
    removed=$(sed -n "${num}p" "$CONFIG" | cut -d'|' -f2)

    # content 폴더에서 즉시 제거
    rm -rf "$QUARTZ/content/$removed"

    # conf에서 해당 줄 삭제
    sed -i "" "${num}d" "$CONFIG"
    echo "✅ 제거됨: $removed (웹사이트에서 삭제됨)"
}

# 동기화 & 배포
deploy() {
    echo ""
    generate_sync
    bash "$SYNC"
    cd "$QUARTZ" || exit 1
    git add -A
    git commit -m "Update notes $(date '+%Y-%m-%d %H:%M')"
    git push origin HEAD:v4
    echo ""
    echo "🚀 배포 완료! 2~3분 후 반영됩니다."
    echo "🔗 https://thelyver.github.io/quartz-site/"
    echo ""
}

# 메인 루프
clear
echo "======================================"
echo "   Quartz 사이트 관리"
echo "======================================"

while true; do
    show_folders
    echo "  [1] 폴더 추가"
    echo "  [2] 폴더 제거"
    echo "  [3] 동기화 & 배포 (git push)"
    echo "  [4] 종료"
    echo ""
    read -p "선택: " choice
    echo ""

    case $choice in
        1) add_folder ;;
        2) remove_folder ;;
        3) deploy ;;
        4) echo "종료합니다."; exit 0 ;;
        *) echo "❌ 잘못된 선택입니다." ;;
    esac
done
