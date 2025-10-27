import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useUserRole() {
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setUserRole(data?.role || '')
      setLoading(false)
    }

    fetchUserRole()
  }, [])

  return { userRole, loading }
}



