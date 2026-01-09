// --- AYARLAR ---
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxI2L3VSKFkmEyz4UmRUbF3YWxpanyz0QWrb5OJhD6LN1Xn3bZj_4-qkDjoH4vbydMFXw/exec";
const PHONE_NUMBER = "905526707279"; 

let bookedSlots = [];

// Sayfa Yüklendiğinde
window.onload = function() {
    initDatePicker();
    
    console.log("Sunucuya bağlanılıyor...");
    
    fetch(APPS_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            bookedSlots = data;
            console.log("✅ Veri Geldi:", bookedSlots);
            
            // Veri gelince kilidi aç
            const dateInput = document.getElementById("dateSelect");
            dateInput.disabled = false;
            dateInput.placeholder = "📅 Tarih Seçiniz...";
        })
        .catch(error => {
            console.error("HATA:", error);
            document.getElementById("dateSelect").placeholder = "Bağlantı Hatası!";
        });
};

// --- MOBİL MENÜ AÇ/KAPA ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // İkonu değiştir (Hamburger <-> Çarpı)
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

function toggleMenu() {
    // Linke tıklanınca menüyü kapat (Mobildeysek)
    if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if(icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

// --- TAKVİM FONKSİYONLARI ---
function initDatePicker() {
    flatpickr("#dateSelect", {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "tr",
        disableMobile: "true",
        onChange: function(selectedDates, dateStr, instance) {
            updateTimeSlots(dateStr);
        }
    });
}

function updateTimeSlots(selectedDate) {
    const timeSelect = document.getElementById("timeSelect");
    timeSelect.innerHTML = ""; 
    timeSelect.disabled = false;

    const startHour = 9;  
    const endHour = 20;   
    const interval = 30;  

    let defaultOption = document.createElement("option");
    defaultOption.text = "Saati Seçiniz...";
    defaultOption.value = "";
    timeSelect.add(defaultOption);

    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += interval) {
            
            let hourStr = h.toString().padStart(2, '0');
            let minStr = m.toString().padStart(2, '0');
            let timeStr = hourStr + ":" + minStr;
            let fullDateTime = selectedDate + " " + timeStr;

            let option = document.createElement("option");
            option.value = fullDateTime;
            option.text = timeStr;

            if (bookedSlots.includes(fullDateTime)) {
                option.text = timeStr + " (DOLU)";
                option.disabled = true; 
                option.style.color = "#ff4d4d"; 
            }
            timeSelect.add(option);
        }
    }
}

// --- WHATSAPP GÖNDERME ---
function sendWhatsapp() {
    var name = document.getElementById("customerName").value;
    var service = document.getElementById("serviceSelect").value;
    var fullDate = document.getElementById("timeSelect").value; 

    if (name === "" || fullDate === "") {
        alert("Lütfen isminizi girin ve uygun bir saat seçin.");
        return;
    }

    var dateObj = new Date(fullDate);
    var fancyDate = dateObj.toLocaleString('tr-TR', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', weekday: 'long'
    });

    var message = "Selamun Aleyküm, ben " + name + ". " + 
                  "Randevu almak istiyorum.\n" +
                  "Tarih: " + fancyDate + "\n" + 
                  "İşlem: " + service;

    var url = "https://wa.me/" + PHONE_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, '_blank').focus();
}