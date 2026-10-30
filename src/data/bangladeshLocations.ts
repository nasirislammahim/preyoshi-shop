export interface BangladeshDivision {
  name: string;
  nameBn: string;
  districts: {
    name: string;
    nameBn: string;
    thanas: string[];
  }[];
}

export const BANGLADESH_DIVISIONS: BangladeshDivision[] = [
  {
    name: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        nameBn: 'ঢাকা',
        thanas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Motijheel', 'Old Dhaka', 'Tejgaon', 'Paltan', 'Rampura', 'Khilgaon', 'Savar', 'Keraniganj', 'Dhamrai']
      },
      {
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        thanas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Tongi']
      },
      {
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        thanas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar']
      },
      {
        name: 'Tangail',
        nameBn: 'টাঙ্গাইল',
        thanas: ['Tangail Sadar', 'Mirzapur', 'Gopalpur', 'Sakhipur', 'Madhupur', 'Ghatail', 'Kalihati']
      },
      {
        name: 'Faridpur',
        nameBn: 'ফরিদপুর',
        thanas: ['Faridpur Sadar', 'Boalmari', 'Bhanga', 'Nagarkanda', 'Sadarpur']
      },
      {
        name: 'Manikganj',
        nameBn: 'মানিকগঞ্জ',
        thanas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya']
      },
      {
        name: 'Munshiganj',
        nameBn: 'মুন্সীগঞ্জ',
        thanas: ['Munshiganj Sadar', 'Sreenagar', 'Tongibari', 'Sirajdikhan', 'Lohajang', 'Gazaria']
      },
      {
        name: 'Narsingdi',
        nameBn: 'নরসিংদী',
        thanas: ['Narsingdi Sadar', 'Raipura', 'Shibpur', 'Belabo', 'Palash', 'Monohardi']
      }
    ]
  },
  {
    name: 'Chittagong',
    nameBn: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chittagong',
        nameBn: 'চট্টগ্রাম',
        thanas: ['Panchlaish', 'Kotwali', 'Khulshi', 'Halishahar', 'Agrabad', 'Patenga', 'Chandgaon', 'Double Mooring', 'Hathazari', 'Sitakunda', 'Patiya', 'Raozan']
      },
      {
        name: 'Cox\'s Bazar',
        nameBn: 'কক্সবাজার',
        thanas: ['Cox\'s Bazar Sadar', 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Maheshkhali']
      },
      {
        name: 'Comilla',
        nameBn: 'কুমিল্লা',
        thanas: ['Comilla Adarsha Sadar', 'Comilla Sadar Dakshin', 'Chandina', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Burichang']
      },
      {
        name: 'Feni',
        nameBn: 'ফেনী',
        thanas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Sonagazi']
      },
      {
        name: 'Brahmanbaria',
        nameBn: 'ব্রাহ্মণবাড়িয়া',
        thanas: ['Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Sarail', 'Ashuganj', 'Akhaura']
      },
      {
        name: 'Noakhali',
        nameBn: 'নোয়াখালী',
        thanas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companyganj', 'Senbagh']
      }
    ]
  },
  {
    name: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      {
        name: 'Sylhet',
        nameBn: 'সিলেট',
        thanas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Fenchuganj', 'Balaganj', 'Biswanath', 'Osmani Nagar']
      },
      {
        name: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        thanas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Barlekha', 'Kamalganj', 'Rajnagar']
      },
      {
        name: 'Habiganj',
        nameBn: 'হবিগঞ্জ',
        thanas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Bahubal', 'Chunarughat']
      },
      {
        name: 'Sunamganj',
        nameBn: 'সুনামগঞ্জ',
        thanas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Tahirpur']
      }
    ]
  },
  {
    name: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      {
        name: 'Rajshahi',
        nameBn: 'রাজশাহী',
        thanas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba', 'Godagari', 'Bagmara', 'Charghat', 'Durgapur', 'Puthia']
      },
      {
        name: 'Bogra',
        nameBn: 'বগুড়া',
        thanas: ['Bogra Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Dhunat']
      },
      {
        name: 'Pabna',
        nameBn: 'পাবনা',
        thanas: ['Pabna Sadar', 'Ishwardi', 'Santhia', 'Bera', 'Sujanagar', 'Chatmohar']
      },
      {
        name: 'Sirajganj',
        nameBn: 'সিরাজগঞ্জ',
        thanas: ['Sirajganj Sadar', 'Ullapara', 'Shahjadpur', 'Belkuchi', 'Kazipur', 'Raiganj']
      },
      {
        name: 'Naogaon',
        nameBn: 'নওগাঁ',
        thanas: ['Naogaon Sadar', 'Manda', 'Mohadevpur', 'Patnitala', 'Badalgachhi']
      }
    ]
  },
  {
    name: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      {
        name: 'Khulna',
        nameBn: 'খুলনা',
        thanas: ['Kotwali', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Dumuria', 'Rupsha', 'Batiaghata', 'Phultala']
      },
      {
        name: 'Jessore',
        nameBn: 'যশোর',
        thanas: ['Jessore Sadar', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Abhaynagar', 'Bagherpara']
      },
      {
        name: 'Kushtia',
        nameBn: 'কুষ্টিয়া',
        thanas: ['Kushtia Sadar', 'Kumarkhali', 'Mirpur', 'Bheramara', 'Daulatpur']
      },
      {
        name: 'Satkhira',
        nameBn: 'সাতক্ষীরা',
        thanas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Kaliganj', 'Shyamnagar']
      }
    ]
  },
  {
    name: 'Barisal',
    nameBn: 'বরিশাল',
    districts: [
      {
        name: 'Barisal',
        nameBn: 'বরিশাল',
        thanas: ['Barisal Sadar (Kotwali)', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara']
      },
      {
        name: 'Patuakhali',
        nameBn: 'পটুয়াখালী',
        thanas: ['Patuakhali Sadar', 'Galachipa', 'Bauphal', 'Kalapara', 'Mirzaganj', 'Dumki']
      },
      {
        name: 'Bhola',
        nameBn: 'ভোলা',
        thanas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Lalmohan', 'Daulatkhan']
      }
    ]
  },
  {
    name: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      {
        name: 'Rangpur',
        nameBn: 'রংপুর',
        thanas: ['Rangpur Sadar', 'Kotwali', 'Badarganj', 'Gangachara', 'Pirgachha', 'Pirganj', 'Mithapukur']
      },
      {
        name: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        thanas: ['Dinajpur Sadar', 'Birganj', 'Parbatipur', 'Fulbari', 'Nawabganj']
      },
      {
        name: 'Kurigram',
        nameBn: 'কুড়িগ্রাম',
        thanas: ['Kurigram Sadar', 'Nageshwari', 'Ulipur', 'Chilmari', 'Bhurungamari']
      }
    ]
  },
  {
    name: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      {
        name: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        thanas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Phulpur', 'Gaffargaon', 'Ishwarganj']
      },
      {
        name: 'Jamalpur',
        nameBn: 'জামালপুর',
        thanas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Madarganj']
      },
      {
        name: 'Netrokona',
        nameBn: 'নেত্রকোণা',
        thanas: ['Netrokona Sadar', 'Kendua', 'Durgapur', 'Mohanganj', 'Barhatta']
      },
      {
        name: 'Sherpur',
        nameBn: 'শেরপুর',
        thanas: ['Sherpur Sadar', 'Nakla', 'Nalitabari', 'Sreebardi', 'Jhenaigati']
      }
    ]
  }
];
