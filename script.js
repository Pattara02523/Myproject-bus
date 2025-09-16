// Firebase Configuration
        const firebaseConfig = window.__firebase_config || {
            apiKey: "demo-key",
            authDomain: "demo.firebaseapp.com",
            projectId: "demo-project",
            storageBucket: "demo.appspot.com",
            messagingSenderId: "123456789",
            appId: "demo-app-id"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();

        // Global Variables
        let currentStep = 1;
        let currentLanguage = 'th';
        let bookingData = {
            originZone: '',
            pickupPoint: '',
            destinationZone: '',
            destinationProvince: '',
            ticketType: '',
            departureDate: '',
            returnDate: '',
            selectedTime: '',
            selectedCompany: '',
            returnTime: '',
            returnCompany: '',
            passengerCount: 1,
            selectedSeats: [],
            returnSeats: [],
            passengerInfo: [],
            totalAmount: 0
        };
        
        console.log('Global variables initialized:');
        console.log('currentStep:', currentStep);
        console.log('bookingData:', bookingData);

        let seatListener = null;
        let selectedTimeSlot = null;

        // Language translations
        const translations = {
            th: {
                // Header
                step: 'ขั้นตอน',
                of: 'จาก',
                
                // Step 1
                selectOriginZone: 'เลือกโซนต้นทาง',
                north: 'ภาคเหนือ',
                central: 'ภาคกลาง',
                northeast: 'ภาคอีสาน',
                south: 'ภาคใต้',
                howToUse: 'วิธีการใช้งาน',
                selectRegion: '• เลือกภูมิภาคที่คุณต้องการเดินทางออกจาก',
                clickZone: '• คลิกที่โซนที่ต้องการ ระบบจะไปขั้นตอนถัดไปโดยอัตโนมัติ',
                backButton: '• หากเลือกผิด สามารถกดปุ่ม "ย้อนกลับ" ที่มุมซ้ายบนได้',
                
                // Step 2
                selectPickupPoint: 'เลือกจุดขึ้นรถ',
                importantInfo: 'ข้อมูลสำคัญ',
                selectStation: '• เลือกสถานีขนส่งที่คุณสะดวกในการเดินทางไป',
                differentPrices: '• แต่ละสถานีมีเวลาออกรถและราคาที่อาจแตกต่างกัน',
                arriveEarly: '• ควรไปถึงสถานีก่อนเวลาออกรถอย่างน้อย 30 นาที',
                
                // Step 3
                selectDestinationZone: 'เลือกโซนปลายทาง',
                selectDestination: 'เลือกจุดหมาย',
                selectDestRegion: '• เลือกภูมิภาคที่คุณต้องการเดินทางไป',
                distancePrice: '• ระยะทางและราคาจะขึ้นอยู่กับจุดต้นทางและปลายทาง',
                crossRegion: '• เส้นทางข้ามภูมิภาคจะใช้เวลานานกว่า',
                
                // Step 4
                selectDestinationProvince: 'เลือกจังหวัดปลายทาง',
                selectProvince: 'เลือกจังหวัด',
                selectDestProv: '• เลือกจังหวัดที่คุณต้องการเดินทางไป',
                scrollProvinces: '• สามารถเลื่อนดูจังหวัดทั้งหมดในภูมิภาคนี้',
                popularFirst: '• จังหวัดที่ได้รับความนิยมจะแสดงก่อน',
                
                // Step 5
                selectTicketType: 'เลือกประเภทตั๋ว',
                oneWay: 'เที่ยวเดียว',
                oneWayDesc: 'เดินทางไปเพียงทิศทางเดียว',
                roundTrip: 'ไป-กลับ',
                roundTripDesc: 'เดินทางไปและกลับ',
                ticketTypes: 'ประเภทตั๋ว',
                oneWayInfo: '• เที่ยวเดียว: เหมาะสำหรับการเดินทางไปเท่านั้น',
                roundTripInfo: '• ไป-กลับ: ประหยัดกว่าและสะดวกสำหรับการเดินทางกลับ',
                returnDateRequired: '• ตั๋วไป-กลับจะต้องเลือกวันที่กลับในขั้นตอนถัดไป',
                
                // Step 6
                selectTravelDate: 'เลือกวันเดินทาง',
                departureDate: 'วันที่เดินทางไป',
                returnDate: 'วันที่เดินทางกลับ',
                selectDate: 'เลือกวันเดินทาง',
                selectTravelDay: '• เลือกวันที่ที่คุณต้องการเดินทาง',
                roundTripDate: '• หากเลือกตั๋วไป-กลับ จะต้องเลือกวันกลับด้วย',
                returnAfterDeparture: '• วันที่กลับต้องหลังจากวันที่ไป',
                noPastDate: '• ไม่สามารถเลือกวันที่ในอดีตได้',
                continue: 'ดำเนินการต่อ',
                
                // Step 7
                selectTravelTime: 'เลือกเวลาเดินทาง',
                pickupPoint: 'จุดขึ้นรถ',
                destination: 'จุดหมาย',
                passengerCount: 'จำนวนผู้โดยสาร',
                selectPassengerCount: 'เลือกจำนวนผู้โดยสาร (สูงสุด 4 คน)',
                selectTime: 'เลือกเวลาเดินทาง',
                selectionSummary: 'สรุปการเลือก',
                route: 'เส้นทาง:',
                date: 'วันที่:',
                time: 'เวลา:',
                company: 'บริษัท:',
                passengers: 'ผู้โดยสาร:',
                totalPrice: 'ราคารวม:',
                notSelected: 'ยังไม่เลือก',
                people: 'คน',
                tips: 'คำแนะนำ',
                clickSelectTime: '• คลิกเลือกเวลาและบริษัทที่ต้องการ',
                priceVaries: '• ราคาแตกต่างตามช่วงเวลาและบริษัท',
                checkSeats: '• ตรวจสอบจำนวนที่นั่งว่าง',
                perPerson: 'ต่อคน',
                seats: 'ที่นั่ง',
                
                // Step 8
                selectSeats: 'เลือกที่นั่ง',
                selectSeatsCount: 'เลือก',
                selectedSeats: 'ที่นั่งที่เลือก:',
                none: 'ไม่มี',
                driver: 'คนขับ',
                allSeats: 'ที่นั่งทั้งหมด (1-30)',
                available: 'ว่าง',
                selected: 'ที่เลือก',
                occupied: 'ไม่ว่าง',
                seatSelection: 'การเลือกที่นั่ง',
                seatInstructions: '• คลิกที่นั่งที่ต้องการ (สีเทา = ว่าง, สีน้ำเงิน = เลือกแล้ว, สีแดง = ไม่ว่าง)',
                selectAllSeats: '• เลือกที่นั่งให้ครบตามจำนวนผู้โดยสาร',
                frontBack: '• ที่นั่งด้านหน้าใกล้คนขับ ที่นั่งด้านหลังเงียบกว่า',
                canChange: '• สามารถเปลี่ยนที่นั่งได้โดยคลิกใหม่',
                confirmSeats: 'ยืนยันที่นั่ง',
                
                // Step 9
                passengerInfo: 'ข้อมูลผู้โดยสาร',
                passenger: 'ผู้โดยสารคนที่',
                seat: 'ที่นั่ง',
                firstName: 'ชื่อ',
                lastName: 'นามสกุล',
                phone: 'เบอร์โทรศัพท์',
                
                // Step 10
                payment: 'ชำระเงิน',
                totalAmount: 'ยอดรวมทั้งหมด',
                bankInfo: 'ข้อมูลบัญชีสำหรับโอนเงิน',
                scbBank: 'ธนาคารไทยพาณิชย์',
                savings: 'ออมทรัพย์',
                accountName: 'ชื่อบัญชี:',
                accountNumber: 'เลขบัญชี:',
                clickToCopy: 'คลิกเพื่อคัดลอก',
                note: 'หมายเหตุ:',
                transferNote: 'โอนเงินตามยอดที่แสดงด้านบน และอัปโหลดสลิปการโอนเพื่อยืนยันการชำระเงิน',
                qrPayment: 'หรือสแกน QR Code เพื่อชำระเงิน',
                scanQR: 'สแกนด้วยแอปธนาคารของคุณ',
                uploadSlip: 'อัปโหลดสลิปการโอนเงิน',
                paymentInfo: 'การชำระเงิน',
                scanQRApp: '• สแกน QR Code ด้วยแอปธนาคารของคุณ',
                transferAmount: '• โอนเงินตามยอดที่แสดง',
                uploadSlipConfirm: '• อัปโหลดสลิปการโอนเงินเพื่อยืนยัน',
                systemVerify: '• ระบบจะตรวจสอบและยืนยันการชำระเงิน',
                confirmPayment: 'ยืนยันการชำระเงิน',
                copied: 'คัดลอกแล้ว!',
                
                // Step 11
                bookingSuccess: 'การซื้อตั๋วสำเร็จ!',
                thankYou: 'ขอบคุณที่ใช้บริการ BotestBus',
                receipt: 'ใบเสร็จรับเงิน',
                passengerList: 'รายชื่อผู้โดยสาร',
                busCompany: 'บริษัทรถ:',
                ticketType: 'ประเภทตั๋ว:',
                total: 'ยอดรวม:',
                qrCode: 'QR Code สำหรับขึ้นรถ',
                purchaseDate: 'วันที่ซื้อ:',
                showReceipt: 'กรุณาแสดงใบเสร็จนี้เมื่อขึ้นรถ',
                contactInfo: 'สอบถามข้อมูลเพิ่มเติม โทร 02-123-4567',
                saveTicket: 'บันทึกตั๋ว',
                buyNew: 'ซื้อใหม่',
                
                // Alerts
                selectDepartureDate: 'กรุณาเลือกวันที่เดินทาง',
                selectReturnDate: 'กรุณาเลือกวันที่เดินทางกลับ',
                returnAfterDepartureAlert: 'วันที่เดินทางกลับต้องหลังจากวันที่เดินทางไป',
                selectTravelTimeAlert: 'กรุณาเลือกเวลาเดินทาง',
                selectSeatsAlert: 'กรุณาเลือกที่นั่ง',
                maxSeatsAlert: 'สามารถเลือกได้สูงสุด',
                fillPassengerInfo: 'กรุณากรอกข้อมูลผู้โดยสารคนที่',
                completeInfo: 'ให้ครบถ้วน',
                phoneFormat: 'เบอร์โทรศัพท์ของผู้โดยสารคนที่',
                phoneDigits: 'ต้องเป็นตัวเลข 10 หลัก',
                paymentSuccess: 'การชำระเงินสำเร็จ!',
                paymentError: 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน',
                saveImageSuccess: 'บันทึกรูปภาพตั๋วสำเร็จ!',
                saveImageError: 'เกิดข้อผิดพลาดในการบันทึกรูปภาพ',
                resetBooking: 'คุณต้องการเริ่มการซื้อตั๋วใหม่หรือไม่?',
                cannotCopy: 'ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง'
            },
            en: {
                // Header
                step: 'Step',
                of: 'of',
                
                // Step 1
                selectOriginZone: 'Select Origin Zone',
                north: 'North',
                central: 'Central',
                northeast: 'Northeast',
                south: 'South',
                howToUse: 'How to Use',
                selectRegion: '• Select the region you want to depart from',
                clickZone: '• Click on the desired zone, system will proceed automatically',
                backButton: '• If wrong selection, use "Back" button at top left',
                
                // Step 2
                selectPickupPoint: 'Select Pickup Point',
                importantInfo: 'Important Information',
                selectStation: '• Choose the bus terminal convenient for you',
                differentPrices: '• Each station may have different departure times and prices',
                arriveEarly: '• Arrive at station at least 30 minutes before departure',
                
                // Step 3
                selectDestinationZone: 'Select Destination Zone',
                selectDestination: 'Select Destination',
                selectDestRegion: '• Choose the region you want to travel to',
                distancePrice: '• Distance and price depend on origin and destination',
                crossRegion: '• Cross-region routes take longer time',
                
                // Step 4
                selectDestinationProvince: 'Select Destination Province',
                selectProvince: 'Select Province',
                selectDestProv: '• Choose the province you want to travel to',
                scrollProvinces: '• Scroll to see all provinces in this region',
                popularFirst: '• Popular provinces are shown first',
                
                // Step 5
                selectTicketType: 'Select Ticket Type',
                oneWay: 'One Way',
                oneWayDesc: 'Travel in one direction only',
                roundTrip: 'Round Trip',
                roundTripDesc: 'Travel both ways',
                ticketTypes: 'Ticket Types',
                oneWayInfo: '• One Way: Suitable for one-way travel only',
                roundTripInfo: '• Round Trip: More economical and convenient for return travel',
                returnDateRequired: '• Round trip tickets require return date selection in next step',
                
                // Step 6
                selectTravelDate: 'Select Travel Date',
                departureDate: 'Departure Date',
                returnDate: 'Return Date',
                selectDate: 'Select Travel Date',
                selectTravelDay: '• Choose your desired travel date',
                roundTripDate: '• For round trip, return date is also required',
                returnAfterDeparture: '• Return date must be after departure date',
                noPastDate: '• Cannot select past dates',
                continue: 'Continue',
                
                // Step 7
                selectTravelTime: 'Select Travel Time',
                pickupPoint: 'Pickup Point',
                destination: 'Destination',
                passengerCount: 'Number of Passengers',
                selectPassengerCount: 'Select number of passengers (max 4)',
                selectTime: 'Select Travel Time',
                selectionSummary: 'Selection Summary',
                route: 'Route:',
                date: 'Date:',
                time: 'Time:',
                company: 'Company:',
                passengers: 'Passengers:',
                totalPrice: 'Total Price:',
                notSelected: 'Not Selected',
                people: 'people',
                tips: 'Tips',
                clickSelectTime: '• Click to select time and company',
                priceVaries: '• Prices vary by time and company',
                checkSeats: '• Check available seats',
                perPerson: 'per person',
                seats: 'seats',
                
                // Step 8
                selectSeats: 'Select Seats',
                selectSeatsCount: 'Select',
                selectedSeats: 'Selected Seats:',
                none: 'None',
                driver: 'Driver',
                allSeats: 'All Seats (1-30)',
                available: 'Available',
                selected: 'Selected',
                occupied: 'Occupied',
                seatSelection: 'Seat Selection',
                seatInstructions: '• Click desired seats (Gray = Available, Blue = Selected, Red = Occupied)',
                selectAllSeats: '• Select seats according to passenger count',
                frontBack: '• Front seats near driver, back seats quieter',
                canChange: '• Can change seats by clicking again',
                confirmSeats: 'Confirm Seats',
                
                // Step 9
                passengerInfo: 'Passenger Information',
                passenger: 'Passenger',
                seat: 'Seat',
                firstName: 'First Name',
                lastName: 'Last Name',
                phone: 'Phone Number',
                
                // Step 10
                payment: 'Payment',
                totalAmount: 'Total Amount',
                bankInfo: 'Bank Account Information for Transfer',
                scbBank: 'Siam Commercial Bank',
                savings: 'Savings',
                accountName: 'Account Name:',
                accountNumber: 'Account Number:',
                clickToCopy: 'Click to Copy',
                note: 'Note:',
                transferNote: 'Transfer the amount shown above and upload transfer slip to confirm payment',
                qrPayment: 'Or scan QR Code to pay',
                scanQR: 'Scan with your banking app',
                uploadSlip: 'Upload Transfer Slip',
                paymentInfo: 'Payment Information',
                scanQRApp: '• Scan QR Code with your banking app',
                transferAmount: '• Transfer the displayed amount',
                uploadSlipConfirm: '• Upload transfer slip for confirmation',
                systemVerify: '• System will verify and confirm payment',
                confirmPayment: 'Confirm Payment',
                copied: 'Copied!',
                
                // Step 11
                bookingSuccess: 'Booking Successful!',
                thankYou: 'Thank you for using BotestBus',
                receipt: 'Receipt',
                passengerList: 'Passenger List',
                busCompany: 'Bus Company:',
                ticketType: 'Ticket Type:',
                total: 'Total:',
                qrCode: 'QR Code for Boarding',
                purchaseDate: 'Purchase Date:',
                showReceipt: 'Please show this receipt when boarding',
                contactInfo: 'For inquiries, call 02-123-4567',
                saveTicket: 'Save Ticket',
                buyNew: 'Buy New',
                
                // Alerts
                selectDepartureDate: 'Please select departure date',
                selectReturnDate: 'Please select return date',
                returnAfterDepartureAlert: 'Return date must be after departure date',
                selectTravelTimeAlert: 'Please select travel time',
                selectSeatsAlert: 'Please select seats',
                maxSeatsAlert: 'Maximum selectable seats:',
                fillPassengerInfo: 'Please complete passenger information for passenger',
                completeInfo: 'completely',
                phoneFormat: 'Phone number for passenger',
                phoneDigits: 'must be 10 digits',
                paymentSuccess: 'Payment successful!',
                paymentError: 'Payment confirmation error',
                saveImageSuccess: 'Ticket image saved successfully!',
                saveImageError: 'Error saving image',
                resetBooking: 'Do you want to start a new booking?',
                cannotCopy: 'Cannot copy automatically, please copy manually'
            }
        };

        // Pickup Points Data
        const pickupPoints = {
            north: [
                { id: 'chiangmai_arcade', name: 'สถานีขนส่งอาเขต', city: 'เชียงใหม่' },
                { id: 'chiangrai_terminal', name: 'สถานีขนส่งเชียงราย', city: 'เชียงราย' },
                { id: 'lampang_terminal', name: 'สถานีขนส่งลำปาง', city: 'ลำปาง' },
                { id: 'phrae_terminal', name: 'สถานีขนส่งแพร่', city: 'แพร่' }
            ],
            central: [
                { id: 'mochit', name: 'สถานีขนส่งหมอชิต', city: 'กรุงเทพมหานคร' },
                { id: 'ekkamai', name: 'สถานีขนส่งเอกมัย', city: 'กรุงเทพมหานคร' },
                { id: 'sai_tai_mai', name: 'สถานีขนส่งสายใต้ใหม่', city: 'กรุงเทพมหานคร' },
                { id: 'kanchanaburi_terminal', name: 'สถานีขนส่งกาญจนบุรี', city: 'กาญจนบุรี' }
            ],
            northeast: [
                { id: 'korat_terminal', name: 'สถานีขนส่งนครราชสีมา', city: 'นครราชสีมา' },
                { id: 'khonkaen_terminal', name: 'สถานีขนส่งขอนแก่น', city: 'ขอนแก่น' },
                { id: 'udon_terminal', name: 'สถานีขนส่งอุดรธานี', city: 'อุดรธานี' },
                { id: 'ubon_terminal', name: 'สถานีขนส่งอุบลราชธานี', city: 'อุบลราชธานี' }
            ],
            south: [
                { id: 'surat_terminal', name: 'สถานีขนส่งสุราษฎร์ธานี', city: 'สุราษฎร์ธานี' },
                { id: 'phuket_terminal', name: 'สถานีขนส่งภูเก็ต', city: 'ภูเก็ต' },
                { id: 'hatyai_terminal', name: 'สถานีขนส่งหาดใหญ่', city: 'สงขลา' },
                { id: 'nakhon_terminal', name: 'สถานีขนส่งนครศรีธรรมราช', city: 'นครศรีธรรมราช' }
            ]
        };

        // Province Data
        const provinces = {
            north: ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'ลำพูน', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'แพร่', 'สุโขทัย', 'ตาก', 'อุตรดิตถ์', 'กำแพงเพชร', 'นครสวรรค์', 'พิจิตร', 'พิษณุโลก', 'เพชรบูรณ์', 'เลย', 'หนองคาย', 'อุดรธานี', 'หนองบัวลำภู'],
            central: ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'นครปราการ', 'สมุทรสาคร', 'สมุทรสงคราม', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี', 'นครนายก', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'สระแก้ว', 'จันทบุรี', 'ตราด', 'เพชรบุรี', 'ประจวบคีรีขันธ์'],
            northeast: ['นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศิลาลักษณ์', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'หนองบัวลำภู', 'ขอนแก่น', 'อุดรธานี', 'เลย', 'หนองคาย', 'บึงกาฬ', 'สกลนคร', 'นครพนม', 'มุกดาหาร', 'ร้อยเอ็ด', 'กาฬสินธุ์', 'มหาสารคาม'],
            south: ['ชุมพร', 'ระนอง', 'สุราษฎร์ธานี', 'พังงา', 'ภูเก็ต', 'กระบี่', 'นครศรีธรรมราช', 'ตรัง', 'พัทลุง', 'สงขลา', 'สตูล', 'ปัตตานี', 'ยะลา', 'นราธิวาส']
        };

        // Time slots with multiple companies
        const timeSlots = [
            { 
                time: '06:00', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 450, available: 15, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'สมบัติทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/sombat.png', price: 420, available: 12, rating: 4.5, class: 'VIP Class', duration: '8ชม. 45ม.' }
                ]
            },
            { 
                time: '08:30', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 480, available: 8, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'เชิดชัยทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/cherdchai.png', price: 460, available: 18, rating: 4.6, class: 'Premium', duration: '8ชม. 15ม.' },
                    { name: 'สมบัติทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/sombat.png', price: 440, available: 10, rating: 4.5, class: 'VIP Class', duration: '8ชม. 45ม.' }
                ]
            },
            { 
                time: '11:00', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 520, available: 6, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'ภูเก็ตทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/phuket.png', price: 500, available: 14, rating: 4.4, class: 'Super VIP', duration: '8ชม. 00ม.' }
                ]
            },
            { 
                time: '14:30', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 500, available: 12, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'สมบัติทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/sombat.png', price: 480, available: 20, rating: 4.5, class: 'VIP Class', duration: '8ชม. 45ม.' },
                    { name: 'เชิดชัยทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/cherdchai.png', price: 490, available: 8, rating: 4.6, class: 'Premium', duration: '8ชม. 15ม.' }
                ]
            },
            { 
                time: '17:00', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 550, available: 4, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'ภูเก็ตทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/phuket.png', price: 530, available: 16, rating: 4.4, class: 'Super VIP', duration: '8ชม. 00ม.' }
                ]
            },
            { 
                time: '20:30', 
                companies: [
                    { name: 'สมบัติทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/sombat.png', price: 480, available: 18, rating: 4.5, class: 'VIP Class', duration: '8ชม. 45ม.' },
                    { name: 'เชิดชัยทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/cherdchai.png', price: 470, available: 22, rating: 4.6, class: 'Premium', duration: '8ชม. 15ม.' }
                ]
            },
            { 
                time: '23:00', 
                companies: [
                    { name: 'นครชัยแอร์', logo: 'https://cdn.buson.me/resource/company_logo/nca.png', price: 450, available: 25, rating: 4.7, class: 'Gold Class', duration: '8ชม. 30ม.' },
                    { name: 'สมบัติทัวร์', logo: 'https://cdn.buson.me/resource/company_logo/sombat.png', price: 430, available: 15, rating: 4.5, class: 'VIP Class', duration: '8ชม. 45ม.' }
                ]
            }
        ];

        // Initialize Authentication
        async function initAuth() {
            try {
                // Use offline mode for demo purposes
                console.log('Running in demo mode - Firebase authentication skipped');
                return true;
            } catch (error) {
                console.error('Authentication failed:', error);
                return false;
            }
        }

        // Helper function to get pickup point name
        function getPickupPointName(pickupPointId) {
            if (!pickupPointId || !bookingData.originZone) return 'หมอชิต';
            
            const points = pickupPoints[bookingData.originZone] || [];
            const point = points.find(p => p.id === pickupPointId);
            return point ? point.name : 'หมอชิต';
        }

        // Custom Alert Functions
        function showCustomAlert(message, type = 'info') {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            
            const icons = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };

            content.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4">${icons[type]}</div>
                    <p class="text-lg mb-6">${message}</p>
                    <button onclick="closeCustomModal()" class="btn-primary text-white px-6 py-2 rounded-lg">
                        ตกลง
                    </button>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }

        function showCustomConfirm(message, onConfirm) {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-content');
            
            content.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4">❓</div>
                    <p class="text-lg mb-6">${message}</p>
                    <div class="flex gap-4 justify-center">
                        <button onclick="closeCustomModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
                            ยกเลิก
                        </button>
                        <button onclick="confirmAction()" class="btn-primary text-white px-6 py-2 rounded-lg">
                            ยืนยัน
                        </button>
                    </div>
                </div>
            `;
            
            window.confirmCallback = onConfirm;
            modal.classList.remove('hidden');
        }

        function confirmAction() {
            if (window.confirmCallback) {
                window.confirmCallback();
                window.confirmCallback = null;
            }
            closeCustomModal();
        }

        function closeCustomModal() {
            document.getElementById('custom-modal').classList.add('hidden');
        }

        // Step Management
        let isTransitioning = false;

        function updateProgress() {
            const totalSteps = bookingData.ticketType === 'roundtrip' ? 13 : 11;
            const progress = (currentStep / totalSteps) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';
            document.getElementById('current-step-display').textContent = currentStep;
            document.getElementById('total-steps-display').textContent = totalSteps;
            
            // Show/hide back button
            const backBtn = document.getElementById('back-btn');
            if (currentStep > 1) {
                backBtn.classList.remove('hidden');
            } else {
                backBtn.classList.add('hidden');
            }
        }

        function showStep(step, direction = 'forward') {
            console.log('showStep called with step:', step, 'direction:', direction);
            console.log('isTransitioning:', isTransitioning);
            if (isTransitioning) {
                console.log('Blocked by isTransitioning in showStep');
                return;
            }
            isTransitioning = true;
            console.log('isTransitioning set to true');

            const currentStepElement = document.getElementById(`step${currentStep}`);
            const targetStepElement = document.getElementById(`step${step}`);

            // Add exit animation to current step
            if (currentStepElement && !currentStepElement.classList.contains('hidden')) {
                currentStepElement.classList.add('slide-out');
                
                setTimeout(() => {
                    // Hide all steps
                    // ปรับ logic ไม่ให้รวม step12/13 ของขากลับในกรณี one-way
                    const maxSteps = bookingData.ticketType === 'roundtrip' ? 13 : 11;
                    for (let i = 1; i <= maxSteps; i++) {
                        // ถ้า one-way ให้ข้าม step 8, 10
                        if (bookingData.ticketType === 'oneway' && (i === 8 || i === 10)) continue;
                        const stepEl = document.getElementById(`step${i}`);
                        if (stepEl) {
                            stepEl.classList.add('hidden');
                            stepEl.classList.remove('slide-out', 'slide-in-left', 'step-transition');
                        }
                    }
                    
                    // Show target step with appropriate animation
                    if (targetStepElement) {
                        targetStepElement.classList.remove('hidden');
                        if (direction === 'backward') {
                            targetStepElement.classList.add('slide-in-left');
                        } else {
                            targetStepElement.classList.add('step-transition');
                        }
                    }
                    
                    currentStep = step;
                    updateProgress();
                    isTransitioning = false;
                }, 300);
            } else {
                // First time showing (no current step)
                const maxSteps = bookingData.ticketType === 'roundtrip' ? 13 : 11;
                for (let i = 1; i <= maxSteps; i++) {
                    const stepEl = document.getElementById(`step${i}`);
                    if (stepEl) {
                        stepEl.classList.add('hidden');
                    }
                }
                
                if (targetStepElement) {
                    targetStepElement.classList.remove('hidden');
                    targetStepElement.classList.add('step-transition');
                }
                
                currentStep = step;
                updateProgress();
                isTransitioning = false;
            }

            // หลังจากแสดง step แล้ว ให้โหลดข้อมูลที่จำเป็น
            setTimeout(() => {
                if (step === 2) {
                    loadPickupPoints();
                } else if (step === 4) {
                    loadProvinces();
                } else if (step === 6) {
                    setupDateInputs();
                } else if (step === 7) {
                    loadTimeSlots();
                } else if (step === 8) {
                    loadReturnTimeSlots();
                } else if (step === 9) {
                    generateSeatMap();
                    listenToSeatChanges();
                } else if (step === 10) {
                    generateReturnSeatMap();
                    listenToReturnSeatChanges();
                } else if (step === 11) {
                    generatePassengerForms();
                } else if (step === 12) {
                    calculateTotal();
                    setupPaymentUpload();
                }
            }, 400);
        }

        function goBack() {
            if (currentStep > 1 && !isTransitioning) {
                let previousStep = currentStep - 1;
                
                // Auto-skip logic for one-way tickets when going back
                if (bookingData.ticketType === 'oneway') {
                    if (previousStep === 10) { // Skip return seat selection
                        previousStep = 9;
                    } else if (previousStep === 8) { // Skip return time selection
                        previousStep = 7;
                    }
                }
                
                // Clean up seat listener if going back from seat selection
                if ((currentStep === 9 || currentStep === 10) && seatListener) {
                    seatListener();
                    seatListener = null;
                }
                
                showStep(previousStep, 'backward');
            }
        }

        function nextStep() {
            // กรณีเลือกเที่ยวเดียว ให้ข้าม step 8 และ 10
            if (bookingData.ticketType === 'oneway') {
                if (currentStep === 7) {
                    currentStep = 9; // ข้ามเลือกเวลาเดินทางกลับ
                } else if (currentStep === 9) {
                    currentStep = 11; // ข้ามเลือกที่นั่งขากลับ
                } else if (currentStep === 11) {
                    currentStep = 12;
                } else if (currentStep === 12) {
                    currentStep = 13;
                } else {
                    currentStep++;
                }
            } else {
                // ไป-กลับ ทำงานตามลำดับปกติ
                currentStep++;
            }
            showStep(currentStep);
        }

        function validateCurrentStep() {
            console.log('validateCurrentStep called for step:', currentStep);
            switch (currentStep) {
                case 6:
                    const departureDate = document.getElementById('departure-date').value;
                    if (!departureDate) {
                        showCustomAlert('กรุณาเลือกวันที่เดินทาง', 'warning');
                        return false;
                    }
                    
                    if (bookingData.ticketType === 'roundtrip') {
                        const returnDate = document.getElementById('return-date').value;
                        if (!returnDate) {
                            showCustomAlert('กรุณาเลือกวันที่เดินทางกลับ', 'warning');
                            return false;
                        }
                        if (new Date(returnDate) <= new Date(departureDate)) {
                            showCustomAlert('วันที่เดินทางกลับต้องหลังจากวันที่เดินทางไป', 'warning');
                            return false;
                        }
                    }
                    
                    bookingData.departureDate = departureDate;
                    if (bookingData.ticketType === 'roundtrip') {
                        bookingData.returnDate = document.getElementById('return-date').value;
                    }
                    break;
                    
                case 7:
                    if (!bookingData.selectedTime) {
                        showCustomAlert('กรุณาเลือกเวลาเดินทาง', 'warning');
                        return false;
                    }
                    break;
                    
                case 8:
                    if (bookingData.ticketType === 'roundtrip' && !bookingData.returnTime) {
                        showCustomAlert('กรุณาเลือกเวลาเดินทางกลับ', 'warning');
                        return false;
                    }
                    break;
                    
                case 9:
                    if (bookingData.selectedSeats.length !== bookingData.passengerCount) {
                        showCustomAlert(`กรุณาเลือกที่นั่ง ${bookingData.passengerCount} ที่`, 'warning');
                        return false;
                    }
                    break;
                    
                case 10:
                    if (bookingData.ticketType === 'roundtrip' && bookingData.returnSeats.length !== bookingData.passengerCount) {
                        showCustomAlert(`กรุณาเลือกที่นั่งขากลับ ${bookingData.passengerCount} ที่`, 'warning');
                        return false;
                    }
                    break;
                    
                case 11:
                    if (!validatePassengerForms()) {
                        return false;
                    }
                    break;
            }
            console.log('validateCurrentStep returning true for step:', currentStep);
            return true;
        }

        // Step Functions
        function selectOriginZone(zone) {
            console.log('selectOriginZone called with zone:', zone);
            console.log('isTransitioning:', isTransitioning);
            if (isTransitioning) {
                console.log('Blocked by isTransitioning');
                return;
            }
            bookingData.originZone = zone;
            console.log('bookingData.originZone set to:', bookingData.originZone);
            highlightSelection(event.target);
            console.log('About to call nextStep in 600ms');
            setTimeout(() => {
                console.log('Calling nextStep now');
                nextStep();
            }, 600);
        }

        function loadPickupPoints() {
            const pickupPointsList = document.getElementById('pickup-points-list');
            const points = pickupPoints[bookingData.originZone] || [];
            
            pickupPointsList.innerHTML = points.map(point => `
                <button onclick="selectPickupPoint('${point.id}')" class="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4 6h16v2H4zm0 5h16v6H4zm2 2h12v2H6z"/>
                            </svg>
                        </div>
                        <div>
                            <div class="font-semibold">${point.name}</div>
                            <div class="text-sm text-gray-600">${point.city}</div>
                        </div>
                    </div>
                </button>
            `).join('');
        }

        function selectPickupPoint(point) {
            if (isTransitioning) return;
            bookingData.pickupPoint = point;
            highlightSelection(event.target);
            setTimeout(() => nextStep(), 600);
        }

        function selectDestinationZone(zone) {
            if (isTransitioning) return;
            bookingData.destinationZone = zone;
            highlightSelection(event.target);
            setTimeout(() => nextStep(), 600);
        }

        function selectProvince(province) {
            if (isTransitioning) return;
            bookingData.destinationProvince = province;
            highlightSelection(event.target);
            setTimeout(() => nextStep(), 600);
        }

        function selectTicketType(type) {
            if (isTransitioning) return;
            bookingData.ticketType = type;
            highlightSelection(event.target);
            setTimeout(() => nextStep(), 600);
        }

        function highlightSelection(element) {
            console.log('highlightSelection called with element:', element);
            // ลบการเลือกก่อนหน้า
            element.parentElement.querySelectorAll('.border-blue-500').forEach(el => {
                el.classList.remove('border-blue-500', 'bg-blue-50');
            });
            
            // เน้นการเลือกปัจจุบัน
            element.classList.add('border-blue-500', 'bg-blue-50');
            console.log('highlightSelection completed');
        }

        function loadProvinces() {
            const provinceList = document.getElementById('province-list');
            const provinceArray = provinces[bookingData.destinationZone] || [];
            
            provinceList.innerHTML = provinceArray.map(province => `
                <button onclick="selectProvince('${province}')" class="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div class="font-semibold">${province}</div>
                </button>
            `).join('');
        }

        function setupDateInputs() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('departure-date').setAttribute('min', today);
            
            if (bookingData.ticketType === 'roundtrip') {
                document.getElementById('return-date-section').classList.remove('hidden');
                document.getElementById('return-date').setAttribute('min', today);
            }
        }

        function loadTimeSlots() {
            const timeSlotsContainer = document.getElementById('time-slots');
            
            // Update summary with current data
            updateSelectionSummary();
            
            let slotsHTML = '';
            
            timeSlots.forEach(timeSlot => {
                slotsHTML += `
                    <div class="mb-4">
                        <button onclick="selectTimeSlot('${timeSlot.time}')" class="time-slot-btn w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-left">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-xl font-bold text-gray-800">${timeSlot.time}</div>
                                        <div class="text-sm text-gray-500">${timeSlot.companies.length} บริษัทให้เลือก</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-green-600">เริ่มต้น ฿${Math.min(...timeSlot.companies.map(c => c.price))}</div>
                                    <div class="text-xs text-gray-500">ต่อคน</div>
                                </div>
                            </div>
                        </button>
                        
                        <!-- Companies list (initially hidden) -->
                        <div id="companies-${timeSlot.time.replace(':', '')}" class="companies-list hidden mt-3 ml-4 space-y-2">
                `;
                
                timeSlot.companies.forEach(company => {
                    slotsHTML += `
                        <div onclick="selectCompany('${timeSlot.time}', ${company.price}, '${company.name}')" class="company-option bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                            <!-- Header -->
                            <div class="flex justify-between items-center mb-3">
                                <div class="flex items-center space-x-3">
                                    <img src="${company.logo}" alt="${company.name}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src=''; this.alt='${company.name}'; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center hidden">
                                        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 6h16v2H4zm0 5h16v6H4zm2 2h12v2H6z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">${company.name}</div>
                                        <div class="text-xs text-gray-500">${company.class}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-xl font-bold text-green-600">฿${company.price}</div>
                                    <div class="text-xs text-gray-500">ต่อคน</div>
                                </div>
                            </div>
                            
                            <!-- Info Row -->
                            <div class="flex justify-between items-center text-sm">
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center space-x-1">
                                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </div>
                                    <span class="text-gray-600">${company.rating}</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span class="text-gray-800 font-bold">${company.available} ที่นั่ง</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                slotsHTML += `
                        </div>
                    </div>
                `;
            });
            
            timeSlotsContainer.innerHTML = slotsHTML;
        }

        function updateSelectionSummary() {
            // Get pickup point name
            const pickupPointName = getPickupPointName(bookingData.pickupPoint);
            
            // Update route
            const routeSummary = document.getElementById('route-summary');
            if (routeSummary) {
                routeSummary.textContent = `${pickupPointName} → ${bookingData.destinationProvince || 'ปลายทาง'}`;
            }
            
            // Update main route display
            const pickupDisplay = document.getElementById('pickup-display');
            const destinationDisplay = document.getElementById('destination-display');
            if (pickupDisplay) {
                pickupDisplay.textContent = pickupPointName;
            }
            if (destinationDisplay) {
                destinationDisplay.textContent = bookingData.destinationProvince || 'เชียงใหม่';
            }
            
            // Update travel date info
            const travelDateInfo = document.getElementById('travel-date-info');
            if (travelDateInfo && bookingData.departureDate) {
                travelDateInfo.textContent = new Date(bookingData.departureDate).toLocaleDateString('th-TH');
            }
            
            // Update ticket type info
            const ticketTypeInfo = document.getElementById('ticket-type-info');
            if (ticketTypeInfo) {
                ticketTypeInfo.textContent = bookingData.ticketType === 'roundtrip' ? 'ไป-กลับ' : 'เที่ยวเดียว';
            }
            
            // Update passenger count info
            const passengerCountInfo = document.getElementById('passenger-count-info');
            if (passengerCountInfo) {
                passengerCountInfo.textContent = `${bookingData.passengerCount} คน`;
            }
            
            // Update date
            const dateSummary = document.getElementById('date-summary');
            if (dateSummary && bookingData.departureDate) {
                dateSummary.textContent = new Date(bookingData.departureDate).toLocaleDateString('th-TH');
            }
            
            // Update passenger count
            const passengerSummary = document.getElementById('passenger-summary');
            if (passengerSummary) {
                passengerSummary.textContent = `${bookingData.passengerCount} คน`;
            }
        }

        function selectTimeSlot(time) {
            // Hide all company lists first
            document.querySelectorAll('.companies-list').forEach(list => {
                list.classList.add('hidden');
            });
            
            // Remove selection from all time slot buttons
            document.querySelectorAll('.time-slot-btn').forEach(btn => {
                btn.classList.remove('border-blue-500', 'bg-blue-50');
            });
            
            // Highlight selected time slot
            event.target.classList.add('border-blue-500', 'bg-blue-50');
            
            // Show companies for selected time
            const companiesId = `companies-${time.replace(':', '')}`;
            const companiesList = document.getElementById(companiesId);
            if (companiesList) {
                companiesList.classList.remove('hidden');
                
                // Scroll to companies list smoothly
                setTimeout(() => {
                    companiesList.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
            }
            
            selectedTimeSlot = time;
            
            // Reset company selection
            bookingData.selectedTime = '';
            bookingData.selectedCompany = '';
            bookingData.basePrice = 0;
            
            // Update summary
            document.getElementById('time-summary').textContent = 'ยังไม่เลือก';
            document.getElementById('company-summary').textContent = 'ยังไม่เลือก';
            document.getElementById('price-summary').textContent = '฿0';
            
            // Disable continue button
            const continueBtn = document.getElementById('continue-step7');
            continueBtn.disabled = true;
            continueBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        function selectCompany(time, price, companyName) {
            bookingData.selectedTime = time;
            bookingData.basePrice = price;
            bookingData.selectedCompany = companyName;
            
            // Remove selection from all company options
            document.querySelectorAll('.company-option').forEach(option => {
                option.classList.remove('border-blue-500', 'bg-blue-50');
            });
            event.target.classList.add('border-blue-500', 'bg-blue-50');
            document.getElementById('time-summary').textContent = time;
            document.getElementById('company-summary').textContent = companyName;
            // อัปเดตวันที่ในสรุป
            const dateSummary = document.getElementById('date-summary');
            if (dateSummary && bookingData.departureDate) {
                dateSummary.textContent = new Date(bookingData.departureDate).toLocaleDateString('th-TH');
            }
            // Calculate and update price
            const totalPrice = price * bookingData.passengerCount * (bookingData.ticketType === 'roundtrip' ? 2 : 1);
            document.getElementById('price-summary').textContent = `฿${totalPrice.toLocaleString()}`;
            
            // Enable continue button
            const continueBtn = document.getElementById('continue-step7');
            continueBtn.disabled = false;
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');

            // Scroll to summary box after selecting company
            const summaryBox = document.getElementById('summary-box');
            if (summaryBox) {
                summaryBox.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Return Time Selection Functions
        function loadReturnTimeSlots() {
            const timeSlotsContainer = document.getElementById('return-time-slots');
            
            // Update summary with return route
            updateReturnSelectionSummary();
            
            let slotsHTML = '';
            
            timeSlots.forEach(timeSlot => {
                slotsHTML += `
                    <div class="mb-4">
                        <button onclick="selectReturnTimeSlot('${timeSlot.time}')" class="return-time-slot-btn w-full bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer text-left">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="text-xl font-bold text-gray-800">${timeSlot.time}</div>
                                        <div class="text-sm text-gray-500">${timeSlot.companies.length} บริษัทให้เลือก</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-green-600">เริ่มต้น ฿${Math.min(...timeSlot.companies.map(c => c.price))}</div>
                                    <div class="text-xs text-gray-500">ต่อคน</div>
                                </div>
                            </div>
                        </button>
                        
                        <!-- Companies list (initially hidden) -->
                        <div id="return-companies-${timeSlot.time.replace(':', '')}" class="return-companies-list hidden mt-3 ml-4 space-y-2">
                `;
                
                timeSlot.companies.forEach(company => {
                    slotsHTML += `
                        <div onclick="selectReturnCompany('${timeSlot.time}', ${company.price}, '${company.name}')" class="return-company-option bg-white border-2 border-green-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                            <!-- Header -->
                            <div class="flex justify-between items-center mb-3">
                                <div class="flex items-center space-x-3">
                                    <img src="${company.logo}" alt="${company.name}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src=''; this.alt='${company.name}'; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="w-10 h-10 bg-green-100 rounded-lg items-center justify-center hidden">
                                        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4 6h16v2H4zm0 5h16v6H4zm2 2h12v2H6z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">${company.name}</div>
                                        <div class="text-xs text-gray-500">${company.class}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-xl font-bold text-green-600">฿${company.price}</div>
                                    <div class="text-xs text-gray-500">ต่อคน</div>
                                </div>
                            </div>
                            
                            <!-- Info Row -->
                            <div class="flex justify-between items-center text-sm">
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center space-x-1">
                                        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </div>
                                    <span class="text-gray-600">${company.rating}</span>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span class="text-gray-800 font-bold">${company.available} ที่นั่ง</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                slotsHTML += `
                        </div>
                    </div>
                `;
            });
            
            timeSlotsContainer.innerHTML = slotsHTML;
        }

        function updateReturnSelectionSummary() {
            // Update return route display
            const returnRouteSummary = document.getElementById('return-route-summary');
            if (returnRouteSummary) {
                returnRouteSummary.textContent = `${bookingData.destinationProvince} → ${getPickupPointName(bookingData.pickupPoint)}`;
            }
            
            // Update return date info
            const returnDateInfo = document.getElementById('return-date-info');
            if (returnDateInfo && bookingData.returnDate) {
                returnDateInfo.textContent = new Date(bookingData.returnDate).toLocaleDateString('th-TH');
            }
        }

        function selectReturnTimeSlot(time) {
            // Hide all return company lists first
            document.querySelectorAll('.return-companies-list').forEach(list => {
                list.classList.add('hidden');
            });
            
            // Remove selection from all return time slot buttons
            document.querySelectorAll('.return-time-slot-btn').forEach(btn => {
                btn.classList.remove('border-green-500', 'bg-green-50');
            });
            
            // Highlight selected return time slot
            event.target.classList.add('border-green-500', 'bg-green-50');
            
            // Show companies for selected return time
            const companiesId = `return-companies-${time.replace(':', '')}`;
            const companiesList = document.getElementById(companiesId);
            if (companiesList) {
                companiesList.classList.remove('hidden');
                
                // Scroll to companies list smoothly
                setTimeout(() => {
                    companiesList.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 100);
            }
            
            // Reset return company selection
            bookingData.returnTime = '';
            bookingData.returnCompany = '';
            bookingData.returnBasePrice = 0;
            
            // Update summary
            document.getElementById('return-time-summary').textContent = 'ยังไม่เลือก';
            document.getElementById('return-company-summary').textContent = 'ยังไม่เลือก';
            document.getElementById('return-price-summary').textContent = '฿0';
            
            // Disable continue button
            const continueBtn = document.getElementById('continue-step8');
            continueBtn.disabled = true;
            continueBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        function selectReturnCompany(time, price, companyName) {
            bookingData.returnTime = time;
            bookingData.returnBasePrice = price;
            bookingData.returnCompany = companyName;
            
            // Remove selection from all return company options
            document.querySelectorAll('.return-company-option').forEach(option => {
                option.classList.remove('border-green-500', 'bg-green-50');
            });
            
            // Highlight selected return company
            event.target.classList.add('border-green-500', 'bg-green-50');
            
            // Update summary
            document.getElementById('return-time-summary').textContent = time;
            document.getElementById('return-company-summary').textContent = companyName;
            
            // อัปเดตวันที่ขากลับในสรุป
            const returnDateSummary = document.getElementById('return-date-summary');
            if (returnDateSummary) {
                returnDateSummary.textContent = bookingData.returnDate || '-';
            }
            
            // Calculate and update return price
            const returnPrice = price * bookingData.passengerCount;
            document.getElementById('return-price-summary').textContent = `฿${returnPrice.toLocaleString()}`;
            
            // Enable continue button
            const continueBtn = document.getElementById('continue-step8');
            continueBtn.disabled = false;
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        function changePassengerCount(delta) {
            const newCount = bookingData.passengerCount + delta;
            if (newCount >= 1 && newCount <= 4) {
                bookingData.passengerCount = newCount;
                document.getElementById('passenger-count').textContent = newCount;
                
                // Update summary
                const passengerSummary = document.getElementById('passenger-summary');
                if (passengerSummary) {
                    passengerSummary.textContent = `${newCount} คน`;
                }
                
                // Update passenger count info in route display
                const passengerCountInfo = document.getElementById('passenger-count-info');
                if (passengerCountInfo) {
                    passengerCountInfo.textContent = `${newCount} คน`;
                }
                
                // Update price if time slot is selected
                if (bookingData.basePrice) {
                    const totalPrice = bookingData.basePrice * newCount * (bookingData.ticketType === 'roundtrip' ? 2 : 1);
                    const priceSummary = document.getElementById('price-summary');
                    if (priceSummary) {
                        priceSummary.textContent = `฿${totalPrice.toLocaleString()}`;
                    }
                }
            }
        }

        // Seat Management
        async function generateSeatMap() {
            const frontSeats = document.getElementById('front-seats');
            const backSeats = document.getElementById('back-seats');
            
            document.getElementById('required-seats').textContent = bookingData.passengerCount;
            
            // Generate front zone seats (1-15)
            let frontHTML = '';
            for (let row = 0; row < 8; row++) {
                frontHTML += '<div class="flex justify-between items-center mb-3">';
                
                // Left side seats (2 seats)
                const leftSeat1 = (row * 2) + 1;
                const leftSeat2 = (row * 2) + 2;
                
                // Only generate if seat number <= 15
                if (leftSeat1 <= 15) {
                    frontHTML += `
                        <div class="flex space-x-3">
                            <div class="seat available" data-seat="${leftSeat1}" onclick="toggleSeat(${leftSeat1})">${leftSeat1}</div>
                            ${leftSeat2 <= 15 ? `<div class="seat available" data-seat="${leftSeat2}" onclick="toggleSeat(${leftSeat2})">${leftSeat2}</div>` : '<div class="w-11"></div>'}
                        </div>
                    `;
                } else {
                    frontHTML += '<div class="flex space-x-3"><div class="w-11"></div><div class="w-11"></div></div>';
                }
                
                // Aisle space
                frontHTML += '<div class="w-16 flex items-center justify-center text-xs text-gray-500 font-medium">ทางเดิน</div>';
                
                // Right side seats (2 seats)
                const rightSeat1 = 16 + (row * 2);
                const rightSeat2 = rightSeat1 + 1;
                
                // Only generate if seat number <= 30
                if (rightSeat1 <= 30) {
                    frontHTML += `
                        <div class="flex space-x-3">
                            <div class="seat available" data-seat="${rightSeat1}" onclick="toggleSeat(${rightSeat1})">${rightSeat1}</div>
                            ${rightSeat2 <= 30 ? `<div class="seat available" data-seat="${rightSeat2}" onclick="toggleSeat(${rightSeat2})">${rightSeat2}</div>` : '<div class="w-11"></div>'}
                        </div>
                    `;
                } else {
                    frontHTML += '<div class="flex space-x-3"><div class="w-11"></div><div class="w-11"></div></div>';
                }
                
                frontHTML += '</div>';
            }
            
            frontSeats.innerHTML = frontHTML;
            
            // Hide back seats section since we only have 30 seats
            backSeats.innerHTML = '';
            
            // Load occupied seats from Firebase
            await loadOccupiedSeats();
        }

        async function loadOccupiedSeats() {
            try {
                // Simulate some occupied seats for demo (adjusted for 30 seats)
                const demoOccupiedSeats = [3, 7, 12, 18, 25, 28];
                
                demoOccupiedSeats.forEach(seatNumber => {
                    const seatElement = document.querySelector(`[data-seat="${seatNumber}"]`);
                    if (seatElement) {
                        seatElement.classList.remove('available');
                        seatElement.classList.add('occupied');
                    }
                });
                
                console.log('Demo occupied seats loaded');
            } catch (error) {
                console.error('Error loading occupied seats:', error);
            }
        }

        function listenToSeatChanges() {
            // Demo mode - no real-time updates needed
            console.log('Demo mode - real-time seat updates disabled');
        }

        function toggleSeat(seatNumber) {
            const seatElement = document.querySelector(`[data-seat="${seatNumber}"]`);
            
            if (seatElement.classList.contains('occupied')) {
                return;
            }

            const isSelected = seatElement.classList.contains('selected');
            const maxSeats = bookingData.passengerCount;

            if (isSelected) {
                seatElement.classList.remove('selected');
                seatElement.classList.add('available');
                bookingData.selectedSeats = bookingData.selectedSeats.filter(seat => seat !== seatNumber);
            } else {
                if (bookingData.selectedSeats.length < maxSeats) {
                    seatElement.classList.remove('available');
                    seatElement.classList.add('selected');
                    bookingData.selectedSeats.push(seatNumber);
                } else {
                    showCustomAlert(`สามารถเลือกได้สูงสุด ${maxSeats} ที่นั่ง`, 'warning');
                    return;
                }
            }

            updateSeatDisplay();
        }

        function updateSeatDisplay() {
            const display = document.getElementById('selected-seats-display');
            const confirmBtn = document.getElementById('confirm-seats-btn');
            
            if (bookingData.selectedSeats.length === 0) {
                display.textContent = 'ไม่มี';
                display.className = 'font-semibold text-gray-500';
            } else {
                display.textContent = bookingData.selectedSeats.sort((a, b) => a - b).join(', ');
                display.className = 'font-semibold text-blue-600';
            }

            if (bookingData.selectedSeats.length === bookingData.passengerCount) {
                confirmBtn.disabled = false;
                confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                confirmBtn.disabled = true;
                confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        async function updateSeatsInFirebase() {
            try {
                // Demo mode - simulate successful seat update
                console.log('Demo mode - seats updated locally:', bookingData.selectedSeats);
                
                // Mark selected seats as occupied in the UI
                bookingData.selectedSeats.forEach(seatNumber => {
                    const seatElement = document.querySelector(`[data-seat="${seatNumber}"]`);
                    if (seatElement) {
                        seatElement.classList.remove('available', 'selected');
                        seatElement.classList.add('occupied');
                    }
                });
                
                return true;
            } catch (error) {
                console.error('Error updating seats:', error);
                return false;
            }
        }

        // Return Seat Management
        async function generateReturnSeatMap() {
            const frontSeats = document.getElementById('return-front-seats');
            const backSeats = document.getElementById('return-back-seats');
            
            document.getElementById('return-required-seats').textContent = bookingData.passengerCount;
            
            // Generate front zone seats (1-15)
            let frontHTML = '';
            for (let row = 0; row < 8; row++) {
                frontHTML += '<div class="flex justify-between items-center mb-3">';
                
                // Left side seats (2 seats)
                const leftSeat1 = (row * 2) + 1;
                const leftSeat2 = (row * 2) + 2;
                
                // Only generate if seat number <= 15
                if (leftSeat1 <= 15) {
                    frontHTML += `
                        <div class="flex space-x-3">
                            <div class="seat available" data-return-seat="${leftSeat1}" onclick="toggleReturnSeat(${leftSeat1})">${leftSeat1}</div>
                            ${leftSeat2 <= 15 ? `<div class="seat available" data-return-seat="${leftSeat2}" onclick="toggleReturnSeat(${leftSeat2})">${leftSeat2}</div>` : '<div class="w-11"></div>'}
                        </div>
                    `;
                } else {
                    frontHTML += '<div class="flex space-x-3"><div class="w-11"></div><div class="w-11"></div></div>';
                }
                
                // Aisle space
                frontHTML += '<div class="w-16 flex items-center justify-center text-xs text-gray-500 font-medium">ทางเดิน</div>';
                
                // Right side seats (2 seats)
                const rightSeat1 = 16 + (row * 2);
                const rightSeat2 = rightSeat1 + 1;
                
                // Only generate if seat number <= 30
                if (rightSeat1 <= 30) {
                    frontHTML += `
                        <div class="flex space-x-3">
                            <div class="seat available" data-return-seat="${rightSeat1}" onclick="toggleReturnSeat(${rightSeat1})">${rightSeat1}</div>
                            ${rightSeat2 <= 30 ? `<div class="seat available" data-return-seat="${rightSeat2}" onclick="toggleReturnSeat(${rightSeat2})">${rightSeat2}</div>` : '<div class="w-11"></div>'}
                        </div>
                    `;
                } else {
                    frontHTML += '<div class="flex space-x-3"><div class="w-11"></div><div class="w-11"></div></div>';
                }
                
                frontHTML += '</div>';
            }
            
            frontSeats.innerHTML = frontHTML;
            
            // Hide back seats section since we only have 30 seats
            backSeats.innerHTML = '';
            
            // Load occupied seats from Firebase for return trip
            await loadReturnOccupiedSeats();
        }

        async function loadReturnOccupiedSeats() {
            try {
                // Simulate different occupied seats for return trip
                const demoReturnOccupiedSeats = [2, 8, 14, 19, 26, 29];
                
                demoReturnOccupiedSeats.forEach(seatNumber => {
                    const seatElement = document.querySelector(`[data-return-seat="${seatNumber}"]`);
                    if (seatElement) {
                        seatElement.classList.remove('available');
                        seatElement.classList.add('occupied');
                    }
                });
                
                console.log('Demo return occupied seats loaded');
            } catch (error) {
                console.error('Error loading return occupied seats:', error);
            }
        }

        function listenToReturnSeatChanges() {
            // Demo mode - no real-time updates needed
            console.log('Demo mode - real-time return seat updates disabled');
        }

        function toggleReturnSeat(seatNumber) {
            const seatElement = document.querySelector(`[data-return-seat="${seatNumber}"]`);
            
            if (seatElement.classList.contains('occupied')) {
                return;
            }

            const isSelected = seatElement.classList.contains('selected');
            const maxSeats = bookingData.passengerCount;

            if (isSelected) {
                seatElement.classList.remove('selected');
                seatElement.classList.add('available');
                bookingData.returnSeats = bookingData.returnSeats.filter(seat => seat !== seatNumber);
            } else {
                if (bookingData.returnSeats.length < maxSeats) {
                    seatElement.classList.remove('available');
                    seatElement.classList.add('selected');
                    bookingData.returnSeats.push(seatNumber);
                } else {
                    showCustomAlert(`สามารถเลือกได้สูงสุด ${maxSeats} ที่นั่ง`, 'warning');
                    return;
                }
            }

            updateReturnSeatDisplay();
        }

        function updateReturnSeatDisplay() {
            const display = document.getElementById('return-selected-seats-display');
            const confirmBtn = document.getElementById('confirm-return-seats-btn');
            
            if (bookingData.returnSeats.length === 0) {
                display.textContent = 'ไม่มี';
                display.className = 'font-semibold text-gray-500';
            } else {
                display.textContent = bookingData.returnSeats.sort((a, b) => a - b).join(', ');
                display.className = 'font-semibold text-green-600';
            }

            if (bookingData.returnSeats.length === bookingData.passengerCount) {
                confirmBtn.disabled = false;
                confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                confirmBtn.disabled = true;
                confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }

        // Passenger Forms
        function generatePassengerForms() {
            const formsContainer = document.getElementById('passenger-forms');
            let formsHTML = '';

            for (let i = 0; i < bookingData.passengerCount; i++) {
                formsHTML += `
                    <div class="bg-gray-50 rounded-xl p-6 border">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">ผู้โดยสารคนที่ ${i + 1} (ที่นั่ง ${bookingData.selectedSeats[i]})</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ</label>
                                <input type="text" id="fname-${i}" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors" placeholder="ชื่อ" required>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">นามสกุล</label>
                                <input type="text" id="lname-${i}" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors" placeholder="นามสกุล" required>
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                                <input type="tel" id="phone-${i}" maxlength="10" pattern="[0-9]{10}" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors" placeholder="0812345678" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required>
                            </div>
                        </div>
                    </div>
                `;
            }

            formsContainer.innerHTML = formsHTML;
        }

        function validatePassengerForms() {
            bookingData.passengerInfo = [];
            
            for (let i = 0; i < bookingData.passengerCount; i++) {
                const fname = document.getElementById(`fname-${i}`).value;
                const lname = document.getElementById(`lname-${i}`).value;
                const phone = document.getElementById(`phone-${i}`).value;

                if (!fname || !lname || !phone) {
                    showCustomAlert(`กรุณากรอกข้อมูลผู้โดยสารคนที่ ${i + 1} ให้ครบถ้วน`, 'warning');
                    return false;
                }

                if (phone.length !== 10 || !/^\d+$/.test(phone)) {
                    showCustomAlert(`เบอร์โทรศัพท์ของผู้โดยสารคนที่ ${i + 1} ต้องเป็นตัวเลข 10 หลัก`, 'warning');
                    return false;
                }

                bookingData.passengerInfo.push({
                    firstName: fname,
                    lastName: lname,
                    phone: phone,
                    seat: bookingData.selectedSeats[i]
                });
            }
            return true;
        }

        // Payment
        function calculateTotal() {
            const departureAmount = bookingData.basePrice * bookingData.passengerCount;
            const returnAmount = bookingData.ticketType === 'roundtrip' ? 
                (bookingData.returnBasePrice * bookingData.passengerCount) : 0;
            
            bookingData.totalAmount = departureAmount + returnAmount;
            
            document.getElementById('total-amount').textContent = `฿${bookingData.totalAmount.toLocaleString()}`;
            
            // Update detailed breakdown if elements exist
            const departurePriceEl = document.getElementById('departure-price');
            const returnPriceEl = document.getElementById('return-price');
            
            if (departurePriceEl) {
                departurePriceEl.textContent = `฿${departureAmount.toLocaleString()}`;
            }
            
            if (returnPriceEl && bookingData.ticketType === 'roundtrip') {
                returnPriceEl.textContent = `฿${returnAmount.toLocaleString()}`;
            }
        }

        function setupPaymentUpload() {
            const fileInput = document.getElementById('payment-slip');
            const confirmBtn = document.getElementById('confirm-payment-btn');
            
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    confirmBtn.disabled = false;
                    confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                } else {
                    confirmBtn.disabled = true;
                    confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
                }
            });
        }

        async function confirmPayment() {
            try {
                // Update seats in Firebase
                await updateSeatsInFirebase();
                
                // Generate ticket number
                bookingData.bookingNumber = 'BUS' + Date.now().toString().substr(-6);
                bookingData.bookingDate = new Date().toLocaleDateString('th-TH');
                
                showCustomAlert('การชำระเงินสำเร็จ!', 'success');
                setTimeout(() => {
                    closeCustomModal();
                    nextStep();
                }, 2000);
            } catch (error) {
                console.error('Payment confirmation error:', error);
                showCustomAlert('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน', 'error');
            }
        }

        // Success Animation
        function showSuccessAnimation() {
            // Phase 1: Show loading animation (0-3 seconds)
            const loadingMessages = [
                'กำลังตรวจสอบข้อมูล',
                'กำลังจองที่นั่ง',
                'กำลังสร้างตั๋ว'
            ];
            
            let messageIndex = 0;
            const messageInterval = setInterval(() => {
                if (messageIndex < loadingMessages.length) {
                    document.getElementById('loading-message').textContent = loadingMessages[messageIndex];
                    messageIndex++;
                } else {
                    clearInterval(messageInterval);
                }
            }, 1000);
            
            // Phase 2: Transition to success (after 3 seconds)
            setTimeout(() => {
                // Change header background color to success green
                const headerSection = document.getElementById('header-section');
                headerSection.className = 'bg-gradient-to-r from-emerald-400 to-green-500 p-8 text-center text-white relative overflow-hidden transition-all duration-1000';
                
                // Hide loading animation
                document.getElementById('loading-animation').style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                document.getElementById('loading-animation').style.opacity = '0';
                document.getElementById('loading-animation').style.transform = 'scale(0.8)';
                
                document.getElementById('loading-text').style.transition = 'opacity 0.5s ease-out';
                document.getElementById('loading-text').style.opacity = '0';
                
                setTimeout(() => {
                    // Hide loading elements completely
                    document.getElementById('loading-animation').classList.add('hidden');
                    document.getElementById('loading-text').classList.add('hidden');
                    
                    // Show success icon with animation
                    const successIcon = document.getElementById('success-icon');
                    successIcon.classList.remove('hidden');
                    successIcon.style.opacity = '0';
                    successIcon.style.transform = 'scale(0.5)';
                    successIcon.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    
                    setTimeout(() => {
                        successIcon.style.opacity = '1';
                        successIcon.style.transform = 'scale(1)';
                    }, 50);
                    
                    // Show success content
                    const successContent = document.getElementById('success-content');
                    successContent.classList.remove('hidden');
                    successContent.style.opacity = '0';
                    successContent.style.transform = 'translateY(20px)';
                    successContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    
                    setTimeout(() => {
                        successContent.style.opacity = '1';
                        successContent.style.transform = 'translateY(0)';
                    }, 300);
                    
                }, 500);
            }, 3000);
        }

        // Helper function to format date in Thai
        function formatThaiDate(dateString) {
            const date = new Date(dateString);
            const thaiMonths = [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ];
            
            const day = date.getDate();
            const month = thaiMonths[date.getMonth()];
            const year = date.getFullYear() + 543; // Convert to Buddhist Era
            
            return `${day} ${month} ${year}`;
        }

        // Helper function to get time icon
        function getTimeIcon(timeString) {
            const hour = parseInt(timeString.split(':')[0]);
            
            if (hour >= 6 && hour < 12) {
                return '🌅'; // Morning
            } else if (hour >= 12 && hour < 18) {
                return '☀️'; // Afternoon
            } else if (hour >= 18 && hour < 21) {
                return '🌆'; // Evening
            } else {
                return '🌙'; // Night
            }
        }

        // Ticket Generation
        function generateTicket() {
            // Show success animation
            showSuccessAnimation();
            
            // Set booking details
            document.getElementById('booking-number').textContent = bookingData.bookingNumber;
            document.getElementById('booking-date').textContent = bookingData.bookingDate;
            
            // Route display
            const zoneNames = {
                north: 'ภาคเหนือ',
                central: 'ภาคกลาง',
                northeast: 'ภาคอีสาน',
                south: 'ภาคใต้'
            };
            
            document.getElementById('route-display').textContent = 
                `หมอชิต → ${bookingData.destinationProvince}`;
            
            // Format date and set time icon
            document.getElementById('travel-date-display').textContent = 
                formatThaiDate(bookingData.departureDate);
            
            document.getElementById('travel-time-display').textContent = bookingData.selectedTime;
            document.getElementById('seats-display').textContent = bookingData.selectedSeats.join(', ');
            
            // แสดงข้อมูลขากลับสำหรับตั๋วไป-กลับ
            if (bookingData.ticketType === 'roundtrip') {
                const returnTripInfo = document.getElementById('return-trip-info');
                returnTripInfo.classList.remove('hidden');
                
                document.getElementById('return-route-display').textContent = 
                    `${bookingData.destinationProvince} → ${getPickupPointName(bookingData.pickupPoint)}`;
                
                document.getElementById('return-date-display').textContent = 
                    formatThaiDate(bookingData.returnDate);
                
                document.getElementById('return-time-display').textContent = bookingData.returnTime;
                
                // แสดงที่นั่งขากลับ
                const returnSeatsDisplay = document.getElementById('return-seats-display');
                if (returnSeatsDisplay) {
                    returnSeatsDisplay.textContent = bookingData.returnSeats.join(', ');
                }
                
                // แสดงบริษัทขากลับ
                const returnCompanyDisplay = document.getElementById('return-company-display');
                if (returnCompanyDisplay) {
                    returnCompanyDisplay.textContent = bookingData.returnCompany;
                }
            }
            
            // Set company name
            document.getElementById('company-display').textContent = bookingData.selectedCompany;
            
            // Set total amount and ticket type
            document.getElementById('total-display').textContent = `฿${bookingData.totalAmount.toLocaleString()}`;
            document.getElementById('ticket-type-display').textContent = bookingData.ticketType === 'roundtrip' ? 'ไป-กลับ' : 'เที่ยวเดียว';
            
            // Passengers display
            const passengersContainer = document.getElementById('passengers-display');
            
            passengersContainer.innerHTML = bookingData.passengerInfo.map((passenger, index) => `
                <div class="bg-gray-50 rounded-lg p-4 border">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-lg font-bold text-gray-800">${passenger.firstName} ${passenger.lastName}</div>
                            <div class="text-sm text-gray-600">โทร: ${passenger.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</div>
                        </div>
                        <div class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-bold">
                            ที่นั่ง ${passenger.seat}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function saveTicketImage() {
            const ticketElement = document.getElementById('ticket-content');
            
            html2canvas(ticketElement, {
                backgroundColor: null,
                scale: 2,
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `BotestBus_Ticket_${bookingData.bookingNumber}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                showCustomAlert('บันทึกรูปภาพตั๋วสำเร็จ!', 'success');
            }).catch(error => {
                console.error('Error saving ticket image:', error);
                showCustomAlert('เกิดข้อผิดพลาดในการบันทึกรูปภาพ', 'error');
            });
        }

        function resetBooking() {
            showCustomConfirm('คุณต้องการเริ่มการซื้อตั๋วใหม่หรือไม่?', () => {
                // Clean up seat listener
                if (seatListener) {
                    seatListener();
                    seatListener = null;
                }
                
                // Reset all data
                currentStep = 1;
                bookingData = {
                    originZone: '',
                    pickupPoint: '',
                    destinationZone: '',
                    destinationProvince: '',
                    ticketType: '',
                    departureDate: '',
                    returnDate: '',
                    selectedTime: '',
                    selectedCompany: '',
                    returnTime: '',
                    returnCompany: '',
                    passengerCount: 1,
                    selectedSeats: [],
                    returnSeats: [],
                    passengerInfo: [],
                    totalAmount: 0
                };
                
                // Reset passenger count display
                document.getElementById('passenger-count').textContent = '1';
                
                showStep(1);
            });
        }

        // Language Functions
        function toggleLanguageMenu() {
            const menu = document.getElementById('language-menu');
            menu.classList.toggle('hidden');
        }

        function changeLanguage(lang) {
            currentLanguage = lang;
            document.getElementById('current-language').textContent = lang === 'th' ? 'ไทย' : 'English';
            document.getElementById('language-menu').classList.add('hidden');
            
            // Update all text elements
            updateLanguage();
        }

        function updateLanguage() {
            const t = translations[currentLanguage];
            
            // Update header
            document.getElementById('step-text').textContent = t.step;
            document.getElementById('of-text').textContent = t.of;
            
            // Update current step content based on currentStep
            updateStepContent();
        }

        function updateStepContent() {
            const t = translations[currentLanguage];
            
            // Update step 1
            const step1Title = document.querySelector('#step1 h2');
            if (step1Title) step1Title.textContent = t.selectOriginZone;
            
            const zoneButtons = document.querySelectorAll('#step1 .zone-btn .font-semibold');
            if (zoneButtons.length >= 4) {
                zoneButtons[0].textContent = t.north;
                zoneButtons[1].textContent = t.central;
                zoneButtons[2].textContent = t.northeast;
                zoneButtons[3].textContent = t.south;
            }
            
            // Update step 2
            const step2Title = document.querySelector('#step2 h2');
            if (step2Title) step2Title.textContent = t.selectPickupPoint;
            
            // Update step 3
            const step3Title = document.querySelector('#step3 h2');
            if (step3Title) step3Title.textContent = t.selectDestinationZone;
            
            const step3ZoneButtons = document.querySelectorAll('#step3 .zone-btn .font-semibold');
            if (step3ZoneButtons.length >= 4) {
                step3ZoneButtons[0].textContent = t.north;
                step3ZoneButtons[1].textContent = t.central;
                step3ZoneButtons[2].textContent = t.northeast;
                step3ZoneButtons[3].textContent = t.south;
            }
            
            // Update step 4
            const step4Title = document.querySelector('#step4 h2');
            if (step4Title) step4Title.textContent = t.selectDestinationProvince;
            
            // Update step 5
            const step5Title = document.querySelector('#step5 h2');
            if (step5Title) step5Title.textContent = t.selectTicketType;
            
            const oneWayBtn = document.querySelector('#step5 .font-semibold');
            if (oneWayBtn) oneWayBtn.textContent = t.oneWay;
            
            const roundTripBtn = document.querySelectorAll('#step5 .font-semibold')[1];
            if (roundTripBtn) roundTripBtn.textContent = t.roundTrip;
            
            // Update step 6
            const step6Title = document.querySelector('#step6 h2');
            if (step6Title) step6Title.textContent = t.selectTravelDate;
            
            const departureLabel = document.querySelector('#step6 label[for="departure-date"]');
            if (departureLabel) departureLabel.textContent = t.departureDate;
            
            const returnLabel = document.querySelector('#step6 label[for="return-date"]');
            if (returnLabel) returnLabel.textContent = t.returnDate;
            
            const continueBtn = document.querySelector('#step6 .btn-primary');
            if (continueBtn) continueBtn.textContent = t.continue;
            
            // Update step 7
            const step7Title = document.querySelector('#step7 h2');
            if (step7Title) step7Title.textContent = t.selectTravelTime;
            
            const pickupDisplay = document.getElementById('pickup-display');
            if (pickupDisplay) pickupDisplay.textContent = currentLanguage === 'th' ? 'หมอชิต' : 'Mo Chit';
            
            const passengerCountTitle = document.querySelector('#step7 h3');
            if (passengerCountTitle) passengerCountTitle.textContent = t.passengerCount;
            
            const passengerCountDesc = document.querySelector('#step7 p');
            if (passengerCountDesc) passengerCountDesc.textContent = t.selectPassengerCount;
            
            // Update step 8
            const step8Title = document.querySelector('#step8 h2');
            if (step8Title) step8Title.textContent = t.selectSeats;
            
            const driverText = document.querySelector('#step8 .bg-gray-800');
            if (driverText) driverText.textContent = `🚗 ${t.driver}`;
            
            const allSeatsText = document.querySelector('#step8 .bg-blue-100');
            if (allSeatsText) allSeatsText.textContent = `🎯 ${t.allSeats}`;
            
            const confirmSeatsBtn = document.getElementById('confirm-seats-btn');
            if (confirmSeatsBtn) confirmSeatsBtn.textContent = t.confirmSeats;
            
            // Update step 9
            const step9Title = document.querySelector('#step9 h2');
            if (step9Title) step9Title.textContent = t.passengerInfo;
            
            // Update step 10
            const step10Title = document.querySelector('#step10 h2');
            if (step10Title) step10Title.textContent = t.payment;
            
            const totalAmountText = document.querySelector('#step10 p');
            if (totalAmountText) totalAmountText.textContent = t.totalAmount;
            
            const bankInfoTitle = document.querySelector('#step10 h3');
            if (bankInfoTitle) bankInfoTitle.textContent = t.bankInfo;
            
            const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
            if (confirmPaymentBtn) confirmPaymentBtn.textContent = t.confirmPayment;
            
            // Update step 11
            const step11Title = document.querySelector('#step11 h2');
            if (step11Title) step11Title.textContent = t.bookingSuccess;
            
            const thankYouText = document.querySelector('#step11 p');
            if (thankYouText) thankYouText.textContent = t.thankYou;
            
            const saveTicketBtn = document.querySelector('#step11 .bg-blue-600 span');
            if (saveTicketBtn) saveTicketBtn.textContent = t.saveTicket;
            
            const buyNewBtn = document.querySelector('#step11 .bg-gray-600 span');
            if (buyNewBtn) buyNewBtn.textContent = t.buyNew;
        }

        // Close language menu when clicking outside
        // document.addEventListener('click', function(event) {
        //     const languageMenu = document.getElementById('language-menu');
        //     const languageButton = event.target.closest('[onclick="toggleLanguageMenu()"]');
            
        //     if (!languageButton && !languageMenu.contains(event.target)) {
        //         languageMenu.classList.add('hidden');
        //     }
        // });

        // Initialize App
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded event fired');
            // Hide loading screen after animation
            setTimeout(() => {
                console.log('Initializing app after 3 seconds');
                document.getElementById('loading-screen').style.display = 'none';
                initAuth();
                console.log('About to call showStep(1)');
                showStep(1);
            }, 3000);

            const departureDateInput = document.getElementById('departure-date');
            if (departureDateInput) {
                departureDateInput.addEventListener('change', function() {
                    bookingData.departureDate = this.value;
                    const dateSummary = document.getElementById('date-summary');
                    if (dateSummary && bookingData.departureDate) {
                        dateSummary.textContent = new Date(bookingData.departureDate).toLocaleDateString('th-TH');
                    }
                });
            }
        });

        // Copy Account Number Function
        function copyAccountNumber() {
            const accountNumber = document.getElementById('account-number').textContent;
            
            // Try to use the modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(accountNumber).then(() => {
                    showCopySuccess();
                }).catch(() => {
                    fallbackCopyTextToClipboard(accountNumber);
                });
            } else {
                // Fallback for older browsers
                fallbackCopyTextToClipboard(accountNumber);
            }
        }

        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showCopySuccess();
            } catch (err) {
                showCustomAlert('ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง', 'warning');
            }
            
            document.body.removeChild(textArea);
        }

        function showCopySuccess() {
            // Create temporary success message
            const copyButton = document.querySelector('[onclick="copyAccountNumber()"]');
            const originalContent = copyButton.innerHTML;
            
            copyButton.innerHTML = `
                <div>
                    <span class="text-sm text-gray-600">${currentLanguage === 'th' ? 'เลขบัญชี:' : 'Account Number:'}</span>
                    <span class="font-bold text-xl text-blue-600 ml-2">4400533990</span>
                </div>
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span class="text-sm text-green-600 font-medium">${translations[currentLanguage].copied}</span>
                </div>
            `;
            
            copyButton.classList.remove('border-gray-300', 'hover:border-blue-400');
            copyButton.classList.add('border-green-400', 'bg-green-50');
            
            setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.classList.remove('border-green-400', 'bg-green-50');
                copyButton.classList.add('border-gray-300', 'hover:border-blue-400');
            }, 2000);
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (seatListener) {
                seatListener();
            }
        });
