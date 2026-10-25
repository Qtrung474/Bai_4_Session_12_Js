const MAX_PAYLOAD_CAPACITY = 5000;
const WARNING_THRESHOLD_PERCENT = 85;

const STORAGE_ZONES = {
    PERISHABLE: "ZONE_COLD",
    FRAGILE: "ZONE_FRAGILE",
    STANDARD: "ZONE_STANDARD"
};

const cargoInventory = [
    {
        cargoId: "CG-101",
        description: "Ca hoi dong lanh",
        cargoType: "PERISHABLE",
        weight: 1200,
        storageZone: "ZONE_COLD"
    },
    {
        cargoId: "CG-102",
        description: "Man hinh may tinh & Linh kien",
        cargoType: "FRAGILE",
        weight: 850,
        storageZone: "ZONE_FRAGILE"
    },
    {
        cargoId: "CG-103",
        description: "Hanh ly vali hanh khach",
        cargoType: "STANDARD",
        weight: 1500,
        storageZone: "ZONE_STANDARD"
    }
];

function getTotalWeight() {
    return cargoInventory.reduce((sum, item) => sum + item.weight, 0);
}

function assignStorageZone(cargoType) {
    return STORAGE_ZONES[cargoType] || STORAGE_ZONES.STANDARD;
}

function addNewCargo() {
    const currentWeight = getTotalWeight();

    const cargoId = prompt("Nhap ma kien hang (vi du: CG-104):");
    if (!cargoId || !cargoId.trim()) {
        alert("Loi: Ma kien hang khong duoc de trong!");
        return;
    }

    const cleanCargoId = cargoId.trim().toUpperCase();
    const isExisted = cargoInventory.some(item => item.cargoId === cleanCargoId);
    if (isExisted) {
        alert(`Loi: Ma kien hang [${cleanCargoId}] da ton tai trong kho!`);
        return;
    }

    const description = prompt("Nhap mo ta hang hoa:");
    if (!description || !description.trim()) {
        alert("Loi: Mo ta hang hoa khong duoc de trong!");
        return;
    }

    const typePrompt = 
        "Chon loai hang hoa:\n" +
        "1. Thuc pham tuoi song / Dong lanh\n" +
        "2. Do dien tu / Thuy tinh (De vo)\n" +
        "3. Hanh ly vali / Hang hoa thuong\n" +
        "Nhap so (1-3):";
    
    const typeChoice = prompt(typePrompt);
    let cargoType = "";

    switch (typeChoice ? typeChoice.trim() : "") {
        case "1":
            cargoType = "PERISHABLE";
            break;
        case "2":
            cargoType = "FRAGILE";
            break;
        case "3":
            cargoType = "STANDARD";
            break;
        default:
            alert("Loi: Loai hang hoa khong hop le!");
            return;
    }

    const weightInput = prompt("Nhap trong luong kien hang (kg):");
    if (weightInput === null) return;

    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
        alert("Loi: Trong luong phai la so lon hon 0!");
        return;
    }

    if (currentWeight + weight > MAX_PAYLOAD_CAPACITY) {
        const remainingCapacity = Math.max(0, MAX_PAYLOAD_CAPACITY - currentWeight);
        alert(
            `TU CHOI TIEP NHAN!\n` +
            `Tong trong luong se vuot qua 100% tai trong an toan (${MAX_PAYLOAD_CAPACITY} kg).\n` +
            `Kien hang: ${weight} kg | Suc chua con lai: ${remainingCapacity} kg.`
        );
        return;
    }

    const storageZone = assignStorageZone(cargoType);

    const newCargo = {
        cargoId: cleanCargoId,
        description: description.trim(),
        cargoType: cargoType,
        weight: weight,
        storageZone: storageZone
    };

    cargoInventory.push(newCargo);
    alert(`Da nhan kien hang [${cleanCargoId}] thanh cong! Phan bo vao: ${storageZone}.`);
    checkPayloadStatus();
}

function displayInventoryByZone() {
    console.log("\n========================================================");
    console.log("       BANG KIEM KE KIEN HANG THEO PHAN KHU KHO         ");
    console.log("========================================================");

    const zones = ["ZONE_COLD", "ZONE_FRAGILE", "ZONE_STANDARD"];

    zones.forEach(zone => {
        const items = cargoInventory.filter(item => item.storageZone === zone);
        const subtotal = items.reduce((sum, item) => sum + item.weight, 0);

        console.log(`\n>>> PHAN KHU: ${zone} (Tong trong luong: ${subtotal} kg)`);
        if (items.length === 0) {
            console.log("   (Hien tai khong co kien hang nao)");
        } else {
            console.table(items.map(item => ({
                "Ma kien": item.cargoId,
                "Mo ta": item.description,
                "Loai hang": item.cargoType,
                "Trong luong (kg)": item.weight
            })));
        }
    });
}

function checkPayloadStatus() {
    const totalWeight = getTotalWeight();
    const usagePercent = ((totalWeight / MAX_PAYLOAD_CAPACITY) * 100).toFixed(2);
    const remaining = MAX_PAYLOAD_CAPACITY - totalWeight;

    console.log("\n--------------------------------------------------------");
    console.log("       KIEM TRA CANH BAO TAI TRONG CHUYEN BAY VN-210    ");
    console.log("--------------------------------------------------------");
    console.log(` Tong trong luong da nhan : ${totalWeight} / ${MAX_PAYLOAD_CAPACITY} kg (${usagePercent}%)`);
    console.log(` Tai trong con lai        : ${remaining} kg`);

    if (totalWeight >= MAX_PAYLOAD_CAPACITY) {
        console.error(" [CANH BAO DO] Khoang hang da DAT 100% TAI TRONG! TU CHOI NHAN THEM KIEN HANG.");
        alert(`CANH BAO DO: Da dat 100% tai trong an toan (${totalWeight}/${MAX_PAYLOAD_CAPACITY} kg). Tu choi nhan hang!`);
    } else if (usagePercent >= WARNING_THRESHOLD_PERCENT) {
        console.warn(` [CANH BAO VANG] Tai trong da vuot nguong an toan ${WARNING_THRESHOLD_PERCENT}%! Can kiem soat chat che.`);
        alert(`CANH BAO VANG: Khoang hang da dat ${usagePercent}% tai trong! Hay can nhac truoc khi nhan them.`);
    } else {
        console.log(" [TRANG THAI AN TOAN] Tai trong dang o muc an toan cho phep.");
    }
    console.log("--------------------------------------------------------\n");
}

function exportCargoManifest() {
    const totalWeight = getTotalWeight();
    const flightNumber = "VN-210";
    const divider = "=".repeat(70);
    const line = "-".repeat(70);

    console.log("\n" + divider);
    console.log("                   AIRPORT CARGO MANIFEST                       ");
    console.log("                 DANH MUC BOC DO LEN MAY BAY                     ");
    console.log(divider);
    console.log(` Chuyen bay       : ${flightNumber}`);
    console.log(` Tong so kien hang: ${cargoInventory.length}`);
    console.log(` Tong tai trong   : ${totalWeight} kg / ${MAX_PAYLOAD_CAPACITY} kg`);
    console.log(line);
    console.log(` ${"STT".padEnd(5)}${"Ma kien".padEnd(12)}${"Mo ta".padEnd(25)}${"Phan khu".padEnd(16)}${"Khoi luong".padStart(10)}`);
    console.log(line);

    cargoInventory.forEach((item, index) => {
        const stt = (index + 1).toString().padEnd(5);
        const id = item.cargoId.padEnd(12);
        const desc = (item.description.length > 22 ? item.description.substring(0, 22) + "..." : item.description).padEnd(25);
        const zone = item.storageZone.padEnd(16);
        const weight = `${item.weight} kg`.padStart(10);
        console.log(` ${stt}${id}${desc}${zone}${weight}`);
    });

    console.log(line);
    console.log(` TONG CONG: ${`${totalWeight} kg`.padStart(57)}`);
    console.log(divider);
    console.log(" Xac nhan boi Bo phan Dieu phoi Kho hang & Boc xep mat dat.");
    console.log(divider + "\n");

    alert("Da xuat Danh muc boc do len may bay (Cargo Manifest) ra Console!");
}

function main() {
    let running = true;

    do {
        const menuPrompt =
            "====================================================\n" +
            "  DIEU PHOI KHO HANG HOA & KIEN HANG HANG KHONG     \n" +
            "               CHUYEN BAY VN-210                    \n" +
            "====================================================\n" +
            "1. Nhap kien hang moi vao kho\n" +
            "2. Xuat bang kiem ke kien hang theo phan khu kho\n" +
            "3. Kiem tra canh bao qua tai trong an toan\n" +
            "4. Xuat danh muc boc do len may bay (Cargo Manifest)\n" +
            "0. Thoat chuong trinh\n" +
            "----------------------------------------------------\n" +
            "Nhap lua chon cua ban (0-4):";

        const choice = prompt(menuPrompt);

        if (choice === null) {
            const confirmExit = confirm("Ban co chac chan muon dong chuong trinh?");
            if (confirmExit) {
                running = false;
                break;
            } else {
                continue;
            }
        }

        switch (choice.trim()) {
            case "1":
                addNewCargo();
                break;
            case "2":
                displayInventoryByZone();
                break;
            case "3":
                checkPayloadStatus();
                break;
            case "4":
                exportCargoManifest();
                break;
            case "0":
                alert("He thong da dong. Ket thuc ca lam viec!");
                running = false;
                break;
            default:
                alert("Lua chon khong hop le! Vui long nhap cac so tu 0 den 4.");
                break;
        }
    } while (running);

    console.log("Ung dung da dung hoat dong.");
}

main();