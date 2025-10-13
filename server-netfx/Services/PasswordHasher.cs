using System.Security.Cryptography;
using System.Text;

namespace ServerNetFx.Services
{
    public static class PasswordHasher
    {
        public static string RandomHex(int bytes = 16)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var data = new byte[bytes];
                rng.GetBytes(data);
                return BitConverter.ToString(data).Replace("-", string.Empty).ToLowerInvariant();
            }
        }

        public static string Hash(string password, string saltHex)
        {
            var salt = FromHex(saltHex);
            var pwd = Encoding.UTF8.GetBytes(password);
            var combined = new byte[salt.Length + pwd.Length];
            Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
            Buffer.BlockCopy(pwd, 0, combined, salt.Length, pwd.Length);
            using (var sha = SHA256.Create())
            {
                var hash = sha.ComputeHash(combined);
                return BitConverter.ToString(hash).Replace("-", string.Empty).ToLowerInvariant();
            }
        }

        private static byte[] FromHex(string hex)
        {
            var length = hex.Length / 2;
            var bytes = new byte[length];
            for (int i = 0; i < length; i++)
            {
                bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            }
            return bytes;
        }
    }
}
