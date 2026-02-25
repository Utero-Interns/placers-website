
"use client"
import { useState, useEffect } from "react"
import NavBar from "@/components/NavBar"
import FootBar from "@/components/footer/FootBar"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type FormDataType = {
  fullname: string
  companyName: string
  ktp: string
  npwp: string
  ktpAddress: string
  officeAddress: string
}

export default function SellerRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormDataType>({
    fullname: "",
    companyName: "",
    ktp: "",
    npwp: "",
    ktpAddress: "",
    officeAddress: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [isLoadingRedirect, setIsLoadingRedirect] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy/seller", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setFormData({
            fullname: data.fullname || "",
            companyName: data.companyName || "",
            ktp: data.ktp || "",
            npwp: data.npwp || "",
            ktpAddress: data.ktpAddress || "",
            officeAddress: data.officeAddress || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch seller data:", error)
      }
    }
    fetchData()
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validasi tiap field
  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "fullname":
        if (!value.trim()) error = "Nama lengkap wajib diisi"
        else if (value.length < 3) error = "Nama minimal 3 karakter"
        break
      case "ktp":
        if (!/^\d{16}$/.test(value)) error = "Nomor KTP harus 16 digit angka"
        break
      case "npwp":
        if (!/^\d{15,16}$/.test(value)) error = "NPWP harus 15–16 digit angka"
        break
      case "companyName":
        if (!value.trim()) error = "Nama perusahaan wajib diisi"
        break
      case "ktpAddress":
        if (value.length < 10) error = "Alamat KTP minimal 10 karakter"
        break
      case "officeAddress":
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/proxy/seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Pendaftaran seller berhasil!")
        setIsLoadingRedirect(true) // Trigger loading overlay
        
        // Refresh Next.js cache/session to update user role
        router.refresh()
        router.push("/seller/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(`Gagal mendaftar: ${errorData.message || "Terjadi kesalahan"}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Terjadi kesalahan koneksi")
    } finally {
      setIsSubmitting(false)
    }
  }

  // helper untuk styling input
  const inputClass = (name: string) =>
    `w-full border rounded-md px-4 py-2 focus:outline-none ${
      errors[name]
        ? "border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
    }`

  if (isLoadingRedirect) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Refreshing session...</p>
        </div>
      </div>
    )
  }

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
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama"
                className={inputClass("fullname")}
              />
              {errors.fullname && touched.fullname && (
                <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
              )}
            </div>

            {/* Nomor KTP */}
            <div>
              <label className="block text-sm font-medium mb-1">Nomor KTP</label>
              <input
                type="text"
                inputMode="numeric"
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
                type="text"
                inputMode="numeric"
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
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan nama perusahaan atau usaha"
                className={inputClass("companyName")}
              />
              {errors.companyName && touched.companyName && (
                <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
              )}
            </div>

            {/* Alamat KTP */}
            <div>
              <label className="block text-sm font-medium mb-1">Alamat KTP</label>
              <input
                type="text"
                name="ktpAddress"
                value={formData.ktpAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan alamat KTP"
                className={inputClass("ktpAddress")}
              />
              {errors.ktpAddress && touched.ktpAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.ktpAddress}</p>
              )}
            </div>

            {/* Alamat Perusahaan */}
            <div>
              <label className="block text-sm font-medium mb-1">Alamat Perusahaan / Usaha</label>
              <input
                type="text"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Masukkan alamat perusahaan atau usaha"
                className={inputClass("officeAddress")}
              />
              {errors.officeAddress && touched.officeAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.officeAddress}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium rounded-md px-6 py-3 transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--color-primary)] hover:bg-red-700"
              }`}
            >
              {isSubmitting ? "Mengirim..." : "Submit"}
            </button>
          </form>
        </div>
      </main>

      <FootBar />
    </div>
  )
}
