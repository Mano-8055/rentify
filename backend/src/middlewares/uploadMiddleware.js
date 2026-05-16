import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsBase = path.join(__dirname, "../../uploads");

["products", "govids", "profiles"].forEach((dir) => {
  const full = path.join(uploadsBase, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(uploadsBase, folder));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

const imageFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|webp)$/i;
  cb(null, allowed.test(file.originalname));
};

export const productUpload = multer({
  storage: createStorage("products"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

export const profileUpload = multer({
  storage: createStorage("profiles"),
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("profileImage");

export const govIdUpload = multer({
  storage: createStorage("govids"),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("governmentId");
