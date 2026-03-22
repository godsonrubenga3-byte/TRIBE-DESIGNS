import { supabase } from '../src/utils/supabase/client';

export const supabaseService = {
  // --- AUTH ---
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // --- STORAGE ---
  async uploadDesignImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `custom-designs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('jersey-designs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('jersey-designs')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadAvatar(file: File) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('assets') // Ensure you created this public bucket
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // --- DATABASE ---
  async saveProfile(profile: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date(),
      });

    if (error) throw error;
  },

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile Fetch Error:", error);
      return null;
    }
    return data;
  },

  async saveOrder(order: any) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        items: order.items,
        total: order.total,
        status: 'Processing',
        payment_method: order.paymentMethod,
        shipping_details: order.shippingDetails,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  async getGarmentStyles() {
    const { data, error } = await supabase
      .from('garment_styles')
      .select('*');

    if (error) throw error;
    return data;
  }
};
