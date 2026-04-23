/* 루미에르: 전화 하이픈, 상담 Supabase, 모바일 FAB */
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    /* 전화번호(휴대폰) 자동 하이픈 — input[name=phone] 전부 */
    (function () {
      function formatKRPhoneDigits(d) {
        var digits = String(d || '').replace(/\D/g, '');
        if (!digits) return '';
        if (digits.length > 11) digits = digits.slice(0, 11);

        if (digits.slice(0, 2) === '02') {
          if (digits.length <= 2) return digits;
          if (digits.length <= 5) return digits.slice(0, 2) + '-' + digits.slice(2);
          if (digits.length <= 9) return digits.slice(0, 2) + '-' + digits.slice(2, 5) + '-' + digits.slice(5);
          return digits.slice(0, 2) + '-' + digits.slice(2, 6) + '-' + digits.slice(6, 10);
        }

        if (digits.slice(0, 3) === '010') {
          if (digits.length <= 3) return digits;
          if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
          return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
        }

        if (digits.slice(0, 3) === '011') {
          if (digits.length <= 3) return digits;
          if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3);
          if (digits.length <= 10) return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
          return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
        }

        if (/^01[6789]/.test(digits)) {
          if (digits.length <= 3) return digits;
          if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
          return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
        }

        if (digits[0] === '0' && digits.length > 3) {
          if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
          return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
        }

        if (digits.length <= 3) return digits;
        if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
        return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
      }

      function digitCountBeforeIndex(str, index) {
        var n = 0;
        var i = 0;
        for (; i < index && i < str.length; i++) {
          if (/\d/.test(str.charAt(i))) n++;
        }
        return n;
      }

      function indexAfterDigitCount(formatted, count) {
        if (count <= 0) return 0;
        var seen = 0;
        var i = 0;
        for (; i < formatted.length; i++) {
          if (/\d/.test(formatted.charAt(i))) {
            seen++;
            if (seen >= count) return i + 1;
          }
        }
        return formatted.length;
      }

      function onPhoneInput(e) {
        var el = e.target;
        if (!el || el.name !== 'phone') return;
        var oldVal = el.value;
        var pos = typeof el.selectionStart === 'number' ? el.selectionStart : oldVal.length;
        var dc = digitCountBeforeIndex(oldVal, pos);
        var next = formatKRPhoneDigits(oldVal);
        el.value = next;
        var np = indexAfterDigitCount(next, dc);
        try {
          el.setSelectionRange(np, np);
        } catch (err) { /* ignore */ }
      }

      document.querySelectorAll('input[name="phone"]').forEach(function (inp) {
        inp.addEventListener('input', onPhoneInput);
      });
    })();

    /* 상담 신청 → Supabase */
    (function () {
      var SUPABASE_URL = 'https://wppaljybzhnpjcycoyru.supabase.co';
      var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcGFsanliemhucGpjeWNveXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTE1OTYsImV4cCI6MjA5MjM2NzU5Nn0.bUlYI77oHkY86vZaZY_WmSoMj7BXplBzKENi-O3blm0';
      var form = document.getElementById('consult-form');
      var msg = document.getElementById('consult-form-msg');
      if (!form) return;

      var sourcePage = (form.getAttribute('data-source-page') || 'index').trim() || 'index';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var name = String(fd.get('name') || '').trim();
        var phone = String(fd.get('phone') || '').trim();
        var agreed = form.querySelector('input[name="agreed_privacy"]');
        var agreedVal = agreed && agreed.checked;
        if (!name || !phone || !agreedVal) return;

        var btn = form.querySelector('.consult-submit-btn');
        var prevLabel = btn ? btn.textContent : '';
        if (btn) {
          btn.disabled = true;
          btn.textContent = '전송 중…';
        }
        if (msg) {
          msg.classList.remove('hidden', 'text-green-700', 'text-red-600', 'text-gray-600');
          msg.textContent = '';
        }

        fetch(SUPABASE_URL + '/rest/v1/consult_requests', {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            agreed_privacy: true,
            source_page: sourcePage,
          }),
        })
          .then(function (res) {
            if (!res.ok) {
              return res.json().then(function (j) {
                throw new Error((j && (j.message || j.hint)) || res.statusText);
              });
            }
            form.reset();
            if (msg) {
              msg.classList.add('text-green-700');
              msg.textContent = '신청이 접수되었습니다. 빠르게 연락드리겠습니다.';
              msg.classList.remove('hidden');
            }
            setTimeout(function () {
              if (typeof window.lumiereConsultPanelClose === 'function') {
                window.lumiereConsultPanelClose();
              }
              if (msg) {
                msg.classList.add('hidden');
                msg.textContent = '';
                msg.classList.remove('text-green-700', 'text-red-600', 'text-gray-600');
              }
            }, 1500);
          })
          .catch(function () {
            if (msg) {
              msg.classList.add('text-red-600');
              msg.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
              msg.classList.remove('hidden');
            }
          })
          .finally(function () {
            if (btn) {
              btn.disabled = false;
              btn.textContent = prevLabel;
            }
          });
      });
    })();

    /* 모바일: FAB · 패널 */
    (function () {
      var root = document.getElementById('consult');
      var backdrop = document.getElementById('consult-backdrop');
      var fab = document.getElementById('consult-fab');
      if (!root || !backdrop || !fab) return;

      var mql = window.matchMedia('(max-width: 767.98px)');
      var form = document.getElementById('consult-form');
      var firstInput = form && form.querySelector('input[name="name"]');
      var iconOpen = fab.querySelector('.consult-fab-icon-open');
      var iconClose = fab.querySelector('.consult-fab-icon-close');

      function isMobileLayout() {
        return mql.matches;
      }

      function setOpen(open) {
        if (!isMobileLayout()) return;
        root.classList.toggle('is-open', open);
        backdrop.classList.toggle('is-open', open);
        backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        fab.setAttribute('aria-label', open ? '상담 폼 닫기' : '1분 상담 신청 열기');
        if (iconOpen) iconOpen.classList.toggle('hidden', open);
        if (iconClose) iconClose.classList.toggle('hidden', !open);
        if (open) {
          document.body.classList.add('overflow-hidden');
          try {
            if (firstInput) firstInput.focus({ preventScroll: true });
          } catch (e) { /* ignore */ }
        } else {
          document.body.classList.remove('overflow-hidden');
          try {
            fab.focus();
          } catch (e) { /* ignore */ }
        }
      }

      function toggle() {
        if (!isMobileLayout()) return;
        setOpen(!root.classList.contains('is-open'));
      }

      fab.addEventListener('click', function () {
        if (!isMobileLayout()) return;
        toggle();
      });

      backdrop.addEventListener('click', function () {
        if (isMobileLayout() && root.classList.contains('is-open')) {
          setOpen(false);
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMobileLayout() && root.classList.contains('is-open')) {
          e.preventDefault();
          setOpen(false);
        }
      });

      function openForAnchor() {
        setOpen(true);
        try {
          root.scrollIntoView({ block: 'end' });
        } catch (e) { /* ignore */ }
      }

      document.querySelectorAll('a[href="#consult"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          if (isMobileLayout()) {
            e.preventDefault();
            openForAnchor();
          }
        });
      });

      if (isMobileLayout() && window.location.hash === '#consult') {
        setTimeout(function () {
          openForAnchor();
        }, 0);
      }

      window.addEventListener('hashchange', function () {
        if (isMobileLayout() && window.location.hash === '#consult') {
          openForAnchor();
        }
      });

      function onLayoutModeChange() {
        if (!mql.matches) {
          document.body.classList.remove('overflow-hidden');
          root.classList.remove('is-open');
          backdrop.classList.remove('is-open');
          backdrop.setAttribute('aria-hidden', 'true');
          fab.setAttribute('aria-expanded', 'false');
          fab.setAttribute('aria-label', '1분 상담 신청 열기');
          if (iconOpen) iconOpen.classList.remove('hidden');
          if (iconClose) iconClose.classList.add('hidden');
        }
      }
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onLayoutModeChange);
      } else if (typeof mql.addListener === 'function') {
        mql.addListener(onLayoutModeChange);
      }

      window.lumiereConsultPanelClose = function () {
        if (isMobileLayout() && root.classList.contains('is-open')) {
          setOpen(false);
        }
      };
    })();
  });
})();
