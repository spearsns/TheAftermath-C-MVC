﻿using System;

namespace TheAftermath_V2.Models
{
    public class NewGameModel
    {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Season { get; set; }
        public string Year { get; set; }
        public string Description { get; set; }
        public int Population { get; set; }
        public string PlayerPassword { get; set; }
        public string AdminPassword { get; set; }
    }
}