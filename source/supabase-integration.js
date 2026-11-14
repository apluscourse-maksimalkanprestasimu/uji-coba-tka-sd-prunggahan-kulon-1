/* Integrasi Supabase untuk aplikasi Uji Coba TKA.
   Isi SUPABASE_PUBLISHABLE_KEY dengan publishable key proyek Anda.
   Jangan pernah menaruh secret/service_role key di file ini. */
(() => {
  const SUPABASE_URL = "https://codoudryxsyonqbvpgdk.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Rw1lO3sKArhyQykEfP2qlg_5OsakbSI";
  let startedAt = null;
  let submitted = false;

  const originalLogin = window.handleLogin;
  window.handleLogin = function (event) {
    const nisn = document.getElementById("input-nisn").value.trim();
    const error = document.getElementById("token-error");
    if (!/^\d{10}$/.test(nisn)) {
      event.preventDefault();
      error.textContent = "NISN harus terdiri dari tepat 10 angka.";
      error.classList.remove("hidden");
      return;
    }
    return originalLogin.call(this, event);
  };

  const originalStart = window.startExam;
  window.startExam = function () {
    startedAt = Date.now();
    return originalStart.apply(this, arguments);
  };

  const originalFinish = window.finishExam;
  window.finishExam = async function () {
    if (submitted) return;
    submitted = true;
    originalFinish.apply(this, arguments);
    const resultCard = document.querySelector("#result-screen .bg-white");
    if (!resultCard) return;
    let status = document.getElementById("supabase-save-status");
    if (!status) {
      status = document.createElement("p");
      status.id = "supabase-save-status";
      status.className = "text-xs text-slate-500";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      resultCard.insertBefore(status, resultCard.querySelector("button"));
    }
    status.textContent = "Menyimpan hasil ujian...";
    const score = Number(document.getElementById("score-display").textContent.trim());
    const correctText = document.getElementById("result-correct-count").textContent;
    const correct = Number((correctText.match(/\d+/) || [0])[0]);
    const duration = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : null;
    try {
      const response = await fetch(SUPABASE_URL + "/rest/v1/exam_results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": "Bearer " + SUPABASE_PUBLISHABLE_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          student_name: userData.nama,
          nisn: userData.nisn,
          school_name: "UPT SD Negeri Prunggahan Kulon 1",
          exam_code: "TKA-2027",
          score,
          correct_count: correct,
          total_questions: 3,
          duration_seconds: duration
        })
      });
      if (!response.ok) throw new Error("HTTP " + response.status + ": " + await response.text());
      status.textContent = "✓ Hasil ujian berhasil disimpan.";
      status.className = "text-xs text-emerald-700 font-semibold";
    } catch (err) {
      console.error("Supabase save failed:", err);
      status.textContent = "Gagal menyimpan hasil. Hubungi guru/pengawas.";
      status.className = "text-xs text-red-600 font-semibold";
      submitted = false;
    }
  };
})();
