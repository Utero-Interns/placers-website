"use client"
import { useState } from "react"
import NavBar from "@/components/NavBar"
import FootBar from "@/components/footer/FootBar"
import Image from "next/image"

type FormDataType = {
  nama: string
  ktp: string
  npwp: string
  perusahaan: string
  alamatKtp: string
  alamatPerusahaan: string
}

export default function SellerRegisterPage() {
  const [formData, setFormData] = useState<FormDataType>({
    nama: "",
    ktp: "",
    npwp: "",
    perusahaan: "",
    alamatKtp: "",
    alamatPerusahaan: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  // Validasi tiap field
  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "nama":
        if (!value.trim()) error = "Nama lengkap wajib diisi"
        else if (value.length < 3) error = "Nama minimal 3 karakter"
        break
      case "ktp":
        if (!/^\d{16}$/.test(value)) error = "Nomor KTP harus 16 digit angka"
        break
      case "npwp":
        if (!/^\d{15,16}$/.test(value)) error = "NPWP harus 15–16 digit angka"
        break
      case "perusahaan":
        if (!value.trim()) error = "Nama perusahaan wajib diisi"
        break
      case "alamatKtp":
        if (value.length < 10) error = "Alamat KTP minimal 10 karakter"
        break
      case "alamatPerusahaan":
        if (value.length < 10) error = "Alamat perusahaan minimal 10 karakter"
        break
    }

    return error
  }

  // Handle perubahan input → validasi langsung
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "number" ? value.replace(/\D/g, "") : value

    setFormData({ ...formData, [name]: newValue })

    const error = validateField(name, newValue)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Track ketika field sudah disentuh
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormDataType])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(
        Object.keys(formData).reduce((acc, key) => {
          acc[key] = true
          return acc
        }, {} as { [key: string]: boolean })
      )
      return
    }

    alert("Form berhasil dikirim!")
  }

  // helper untuk styling input
  const inputClass = (name: string) =>
    `w-full border rounded-md px-4 py-2 focus:outline-none ${
      errors[name]
        ? "border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
    }`

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-20 py-10 text-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Kiri: Ilustrasi + Text */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Gabung Jadi Seller</h1>
            <p className="text-gray-600 text-base">
              Mulai tawarkan produk atau jasa kamu di Placers sekarang juga.
            </p>
            <Image
              src="/ilustrasi-join-seller.svg"
              alt="Ilustrasi Seller"
              width={400}
              height={400}
              className="w-full max-w-xs md:max-w-sm"
            />
          </div>

          {/* Kanan: Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama"
                className={inputClass("nama")}
              />
              {errors.nama && touched.nama && (
                <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
              )}
            </div>

            {/* Nomor KTP */}
            <div>
              <label className="block text-sm font-medium mb-1">Nomor KTP</label>
              <input
                type="number"
                name="ktp"
                value={formData.ktp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nomor KTP"
                className={inputClass("ktp")}
              />
              {errors.ktp && touched.ktp && (
                <p className="text-red-500 text-xs mt-1">{errors.ktp}</p>
              )}
            </div>

            {/* NPWP */}
            <div>
              <label className="block text-sm font-medium mb-1">NPWP</label>
              <input
                type="number"
                name="npwp"
                value={formData.npwp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nomor NPWP"
                className={inputClass("npwp")}
              />
              {errors.npwp && touched.npwp && (
                <p className="text-red-500 text-xs mt-1">{errors.npwp}</p>
              )}
            </div>

            {/* Nama Perusahaan */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama Perusahaan / Usaha</label>
              <input
                type="text"
                name="perusahaan"
                value={formData.perusahaan}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama perusahaan atau usaha"
                className={inputClass("perusahaan")}
              />
              {errors.perusahaan && touched.perusahaan && (
                <p className="text-red-500 text-xs mt-1">{errors.perusahaan}</p>
              )}
            </div>

            {/* Alamat KTP */}
            <div>
              <label className="block text-sm font-medium mb-1">Alamat KTP</label>
              <input
                type="text"
                name="alamatKtp"
                value={formData.alamatKtp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan alamat KTP"
                className={inputClass("alamatKtp")}
              />
              {errors.alamatKtp && touched.alamatKtp && (
                <p className="text-red-500 text-xs mt-1">{errors.alamatKtp}</p>
              )}
            </div>

            {/* Alamat Perusahaan */}
            <div>
              <label className="block text-sm font-medium mb-1">Alamat Perusahaan / Usaha</label>
              <input
                type="text"
                name="alamatPerusahaan"
                value={formData.alamatPerusahaan}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan alamat perusahaan atau usaha"
                className={inputClass("alamatPerusahaan")}
              />
              {errors.alamatPerusahaan && touched.alamatPerusahaan && (
                <p className="text-red-500 text-xs mt-1">{errors.alamatPerusahaan}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] hover:bg-red-700 text-white font-medium rounded-md px-6 py-3 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <FootBar />
    </div>
  )
}
